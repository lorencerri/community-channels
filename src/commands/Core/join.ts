import { ApplyOptions } from '@sapphire/decorators';
import {
	AutocompleteCommand,
	Command,
	CommandOptions,
	container,
	RegisterBehavior,
} from '@sapphire/framework';

@ApplyOptions<CommandOptions>({
	name: 'join',
	description: 'Joins a channel.',
	requiredClientPermissions: ['EMBED_LINKS', 'MANAGE_CHANNELS'],
	chatInputCommand: {
		register: true,
		guildIds: ['608178003393904650']
	},
})
export class JoinCommand extends Command {
	async chatInputRun(interaction: Command.ChatInputInteraction) {
		console.log(`Join Command: ${interaction.user.tag} -> #${interaction.options.getString('name')}`);
		if (!interaction.guild) throw new Error('Sorry, this command can only run in guilds.');

		const id = String(interaction.options.get('name')?.value) || '';
		const categoryIds: String[] = await container.db.get(`categories_${interaction.guild.id}`) || [];
		if (!id.match(/^[0-9]+$/)) return interaction.reply({ content: `> Sorry, that does not look like a valid channel.`, ephemeral: true });

		const channel = await interaction.guild.channels.fetch(id);
		if (!channel) return await interaction.reply({ content: `> Sorry, I could not find a channel with the specified ID.`, ephemeral: true });
		if (!channel.parentId) return await interaction.reply({ content: `> Sorry, that channel is not part of a valid category.`, ephemeral: true });
		if (!categoryIds.includes(channel.parentId)) return await interaction.reply({ content: `> Sorry, that channel is not joinable.`, ephemeral: true });

		channel.permissionOverwrites.edit(interaction.user, { VIEW_CHANNEL: true });
		await interaction.reply({ content: `> Successully added you to ${channel.toString()}`, ephemeral: true });
	}

	public async autocompleteRun(...[interaction]: Parameters<AutocompleteCommand['autocompleteRun']>) {
		if (!interaction.guild) throw new Error('Sorry, this command can only run in guilds.');
		const query = (String(interaction.options.getFocused()) || "").trim().toLowerCase();

		const categoryIds: String[] = await container.db.get(`categories_${interaction.guild.id}`) || [];
		const channels = await interaction.guild.channels.fetch();
		const categories = channels.filter(c => categoryIds.includes(c.id));
		const children = [];

		for (const [_, category] of categories) {
			if (category.type === 'GUILD_CATEGORY') {
				for (const [_, channel] of category.children) {
					if (channel.name.toLowerCase().includes(query)) children.push({ name: channel.name, value: channel.id });
				}
			}
		}

		return interaction.respond(children.slice(0, 25));
	}

	registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('join')
				.setDescription('Joins a channel')
				.addStringOption(option => //
					option.setName('name').setDescription('The name of the channel to join').setRequired(true).setAutocomplete(true)),
			{ behaviorWhenNotIdentical: RegisterBehavior.Overwrite }
		);
	}
}