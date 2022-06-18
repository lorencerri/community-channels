import { ApplyOptions } from '@sapphire/decorators';
import {
	Command,
	CommandOptions,
	RegisterBehavior,
} from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';
import { updateGUI } from '../../lib/utils';

@ApplyOptions<CommandOptions>({
	name: 'create',
	description: 'Creates a channel.',
	requiredClientPermissions: ['EMBED_LINKS', 'MANAGE_CHANNELS'],
	chatInputCommand: {
		register: true,
		guildIds: ['608178003393904650']
	},
})
export class CreateCommand extends Command {
	async chatInputRun(interaction: Command.ChatInputInteraction) {
		if (!interaction.guild) throw new Error('> Sorry, this command can only run in guilds.');

		const name = (interaction.options.get('name')?.value || '').toString();
		const member = await interaction.guild.members.fetch(interaction.user.id);

		// Validate channel name
		if (name.length === 0) return interaction.reply("> Please provide a channel name.")

		// Check if they have the editor role
		if (!member.roles.cache.find(r => r.name === 'Editor')) return interaction.reply('> Sorry, you need the editor role to create pages.');

		// Check if they already are managers of 2 channels
		const channels = await interaction.guild.channels.fetch();
		const hasPermissionsIn = channels.filter(c => c.permissionsFor(member).has('MANAGE_CHANNELS')).size;
		if (hasPermissionsIn >= 2 && !member.permissions.has('MANAGE_GUILD')) return interaction.reply("> Sorry, you're already managing 2 channels.");

		// Get the active category
		const categoryId: string = await this.container.db.get(`categories_${interaction.guild.id}`) || '';
		if (!categoryId) throw new Error("> Sorry, this server doesn't have the active category set.");
		const category = await interaction.guild.channels.fetch(categoryId);
		if (category === null || category.type !== 'GUILD_CATEGORY') throw new Error('> Sorry, the active category is not a category.');

		// Create the channel in the active category
		const channel = await interaction.guild.channels.create(name, {
			type: "GUILD_TEXT",
			permissionOverwrites: [{
				id: interaction.guild.id,
				deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
			},
			{
				id: interaction.user.id,
				allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'MANAGE_THREADS']
			}],
			parent: category
		});

		// Send message in channel
		const embed = new MessageEmbed()
			.setColor(0x8349c3)
			.setTitle(`Hello ${member.user.username}!`)
			.setDescription(`I'm **Professor Helper**, let me introduce you to your new page in the wonderful world of **Hypnospace**!\n\nCurrently, you're the only person here. Although, others can join you by doing \`/join ${channel.name}\`, or by creating a \`/portal\` in another channel!\n\nLastly, while you have full permissions to manage this channel and send messages, others will only be able to view. But don't fret, you can create threads if you want to communicate with them!\n\nEnjoy!\n- Professor Helper`)
			.setThumbnail('https://fs.plexidev.org/api/JBNtvtm.gif')
			.setFooter({ text: 'And remember, Merchantsoft is always watching!' })

		await channel.send({ embeds: [embed], content: `${member.toString()}, over here!` });

		// Update the GUI
		await interaction.reply(`> Created channel \`${name}\`...`)
		await updateGUI(interaction.guild);
	}

	registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('create')
				.setDescription('Creates a channel')
				.addStringOption(option => //
					option.setName('name').setDescription('The name of the channel to create').setRequired(true)),
			{ behaviorWhenNotIdentical: RegisterBehavior.Overwrite }
		);
	}
}