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
	name: 'leave',
	description: 'Leaves a channel.',
	requiredClientPermissions: ['EMBED_LINKS', 'MANAGE_CHANNELS'],
	chatInputCommand: {
		register: true,
		guildIds: ['608178003393904650']
	},
})
export class LeaveCommand extends Command {
	async chatInputRun(interaction: Command.ChatInputInteraction) {
		if (!interaction.guild) throw new Error('Sorry, this command can only run in guilds.');

		const id = String(interaction.options.get('name')?.value) || '';
		const categoryIds: String[] = await container.db.get(`categories_${interaction.guild.id}`) || [];
		if (!id.match(/^[0-9]+$/)) return interaction.reply({ content: `> Sorry, that does not look like a valid channel.`, ephemeral: true });

		const channel = await interaction.guild.channels.fetch(id);
		if (!channel) return await interaction.reply({ content: `> Sorry, I could not find a channel with the specified ID.`, ephemeral: true });
		if (!channel.parentId) return await interaction.reply({ content: `> Sorry, that channel is not part of a valid category.`, ephemeral: true });
		if (!categoryIds.includes(channel.parentId)) return await interaction.reply({ content: `> Sorry, that channel is not leavable.`, ephemeral: true });

		channel.permissionOverwrites.edit(interaction.user, { VIEW_CHANNEL: false });
		await interaction.reply({ content: `> Successully removed you from ${channel.toString()}`, ephemeral: true });

		await updateGUI(interaction.guild);
	}

	public async autocompleteRun(...[interaction]: Parameters<AutocompleteCommand['autocompleteRun']>) {
		if (!interaction.guild) throw new Error('Sorry, this command can only run in guilds.');

		const query = (String(interaction.options.getFocused()) || "").trim().toLowerCase();

		const categoryIds: String[] = await container.db.get(`categories_${interaction.guild.id}`) || [];
		const channels = await interaction.guild.channels.fetch();
		const categories = channels.filter(c => {
			const permissions = c.permissionsFor(interaction.user);
			if (!categoryIds.includes(c.id) || !permissions?.has('VIEW_CHANNEL')) return false;
			else return true;
		});
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
				.setName('leave')
				.setDescription('Leaves a channel')
				.addStringOption(option => //
					option.setName('name').setDescription('The name of the channel to leave').setRequired(true).setAutocomplete(true)),
			{ behaviorWhenNotIdentical: RegisterBehavior.Overwrite }
		);
	}
}