import { ApplyOptions } from '@sapphire/decorators';
import {
	AutocompleteCommand,
	Command,
	CommandOptions,
	container,
	RegisterBehavior,
} from '@sapphire/framework';

@ApplyOptions<CommandOptions>({
	name: 'categories',
	description: 'List or add a category to the joinable catalog.',
	requiredClientPermissions: ['EMBED_LINKS'],
	requiredUserPermissions: ['MANAGE_GUILD'],
	chatInputCommand: {
		register: true,
		idHints: ['986051805773434880'],
		guildIds: ['608178003393904650']
	},
})
export class CategoriesCommand extends Command {
	async chatInputRun(interaction: Command.ChatInputInteraction) {
		if (!interaction.guild) throw new Error('Sorry, this command can only run in guilds.');

		const type = interaction.options.getSubcommand(true);
		const id = String(interaction.options.get('id')?.value) || '';

		const categoryIds: String[] = await container.db.get(`categories_${interaction.guild.id}`) || [];

		if (type === 'list') {
			if (categoryIds.length === 0) return interaction.reply(`> No categories found!`)
			else {
				const categories = interaction.guild.channels.cache.filter(c => categoryIds.includes(c.id));
				return interaction.reply(`>>> **Categories**\n\`\`\`${categories.map(c => c.name).join('\n')}\`\`\``)
			}
		} else if (type === 'add') {
			if (categoryIds.includes(id)) return interaction.reply("> That category is already added!")
			await container.db.push(`categories_${interaction.guild.id}`, id);
			return interaction.reply('> Category Added!')
		} else if (type === 'remove') {
			if (!categoryIds.includes(id)) throw new Error("Category has not been added")
			await container.db.pull(`categories_${interaction.guild.id}`, id)
			return interaction.reply('> Category Removed!')
		}
	}

	public async autocompleteRun(...[interaction]: Parameters<AutocompleteCommand['autocompleteRun']>) {
		if (!interaction.guild) throw new Error('Sorry, this command can only run in guilds.');

		const type = interaction.options.getSubcommand(true);
		const query = (String(interaction.options.getFocused()) || "").trim().toLowerCase();

		if (type === 'add') {
			const categories = interaction.guild?.channels.cache.filter(c => c.type === 'GUILD_CATEGORY' && c.name.toLowerCase().includes(query));
			if (!categories) throw new Error("Unable to fetch categories...");
			if (categories.size === 0) return;

			return interaction.respond(categories.map((c) => ({ name: c.name, value: c.id })))
		} else if (type === 'remove') {
			const categoryIds: String[] = await container.db.get(`categories_${interaction.guild.id}`) || [];
			const categories = interaction.guild.channels.cache.filter(c => categoryIds.includes(c.id) && c.name.toLowerCase().includes(query));
			return interaction.respond(categories.map((c) => ({ name: c.name, value: c.id })))
		}
	}

	registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('categories')
				.setDescription('List or add a category to the joinable catalog')
				.addSubcommand(subcommand => subcommand.setName('add').setDescription('Add category')
					.addStringOption(option => //
						option.setName('id').setDescription('The name of the piece to reload').setRequired(true).setAutocomplete(true)))
				.addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove category')
					.addStringOption(option => //
						option.setName('id').setDescription('The name of the store to reload').setRequired(true).setAutocomplete(true)))
				.addSubcommand(subcommand => subcommand.setName('list').setDescription('List joinable categories')),
			{ behaviorWhenNotIdentical: RegisterBehavior.Overwrite }
		);
	}
}