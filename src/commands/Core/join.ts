import { ApplyOptions } from '@sapphire/decorators';
import {
	AutocompleteCommand,
	Command,
	CommandOptions,
	container,
	RegisterBehavior,
} from '@sapphire/framework';
import { updateGUI } from '../../lib/utils';

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
		if (!interaction.guild) throw new Error('Sorry, this command can only run in guilds.');

		const id = String(interaction.options.get('name')?.value) || '';
		const categoryIds: String[] = await container.db.get(`categories_${interaction.guild.id}`) || [];

		const channel = await interaction.guild.channels.fetch(id);
		if (!channel) throw new Error("Sorry, I could not find a channel with that ID.")
		if (!channel.parentId) throw new Error("Sorry, that channel is not part of a category.");
		if (!categoryIds.includes(channel.parentId)) throw new Error("Sorry, that channel is not joinable.");

		channel.permissionOverwrites.edit(interaction.user, { VIEW_CHANNEL: true });
		await interaction.reply({ content: `> Successully added you to ${channel.toString()}`, ephemeral: true });

		await updateGUI(interaction.guild);
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
					if (channel.name.toLowerCase().includes(query)) children.push({ name: channel.name, value: channel.id })
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