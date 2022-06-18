import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/framework';
import {
	Command,
	CommandOptions,
	RegisterBehavior,
} from '@sapphire/framework';
import { getMessageFromUrl, updateGUI } from '../../lib/utils';

@ApplyOptions<CommandOptions>({
	name: 'gui',
	description: 'Creates a GUI of joininable channels.',
	requiredUserPermissions: ['MANAGE_GUILD'],
	requiredClientPermissions: ['EMBED_LINKS', 'MANAGE_CHANNELS'],
	chatInputCommand: {
		register: true,
		guildIds: ['608178003393904650']
	},
})

export class GUICommand extends Command {
	async chatInputRun(interaction: Command.ChatInputInteraction) {

		if (!interaction.guild) throw new Error('Sorry, this command can only run in guilds.');
		if (!interaction.channel) throw new Error('Sorry, this command can only run in channels.');

		const messageURL = interaction.options.get('message')?.value || '';

		if (messageURL) {
			const message = await getMessageFromUrl(messageURL.toString());
			if (!message) throw new Error("Unable to resolve messageURL to a message.");
			await container.db.set(`gui_${interaction.guild.id}`, message.url);
			interaction.reply(`Successfully set the message to be overwritten:\n\`${message.url}\``);
		} else {
			const message = await interaction.channel.send('> Generating GUI...');
			await container.db.set(`gui_${interaction.guild.id}`, message.url);
			interaction.reply(`Successfully created a new GUI message.`)
		}

		updateGUI(interaction.guild);
	}

	registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('gui')
				.setDescription('Creates a GUI')
				.addStringOption(option => //
					option.setName('message').setDescription('A link to the message you want to overwrite')),
			{ behaviorWhenNotIdentical: RegisterBehavior.Overwrite }
		);
	}
}