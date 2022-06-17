import { ApplyOptions } from '@sapphire/decorators';
import {
	Command,
	CommandOptions,
	RegisterBehavior,
} from '@sapphire/framework';
import { generateList } from '../../lib/utils';
import { randomBytes } from 'crypto';

@ApplyOptions<CommandOptions>({
	name: 'gui',
	description: 'Creates a GUI of joininable channels.',
	requiredClientPermissions: ['EMBED_LINKS', 'MANAGE_CHANNELS'],
	chatInputCommand: {
		register: true,
		guildIds: ['608178003393904650']
	},
})
export class CategoriesCommand extends Command {
	async chatInputRun(interaction: Command.ChatInputInteraction) {
		if (!interaction.guild) throw new Error('Sorry, this command can only run in guilds.');
		if (!interaction.channel) throw new Error('Sorry, this command can only run in channels.');

		//const messageURL = String(interaction.options.get('message')?.value);
		let message;

		message = await interaction.channel.send('> Generating...');
		if (!message) return interaction.reply("> Unable to fetch message.");

		const base = `./files/${interaction.guild.id}`;
		const count = await generateList(base, [...new Array(200)].map((_, i) => `Item #${i}`));
		let reply = '';

		for (let i = 1; i <= count; i++) reply += `https://community.plexidev.org/gui/${interaction.guild.id}/${i}.png?random=${randomBytes(4).toString('hex')} `;

		message.edit(reply)
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