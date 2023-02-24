import { ApplyOptions } from '@sapphire/decorators';
import {
	Command,
	CommandOptions,
	RegisterBehavior,
} from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'info',
	description: 'Displays the information embed.',
	requiredClientPermissions: ['EMBED_LINKS', 'MANAGE_CHANNELS'],
	chatInputCommand: {
		register: true,
		guildIds: ['608178003393904650']
	},
})
export class InfoCommand extends Command {
	async chatInputRun(interaction: Command.ChatInputInteraction) {
		if (!interaction.guild) throw new Error('Sorry, this command can only run in guilds.');

		const embed = new MessageEmbed()
			.setColor(0x8087f6)
			.setDescription(`**The search engine is back online!** You can create pages using \`/create <name>\`, assuming you have the editor role. If you have an existing page, ping <@144645791145918464> to get access to manage it. Also, the source code is available [here](https://github.com/lorencerri/community-channels) if you want to check it out. **Enjoy!**`)
			.setThumbnail('https://fs.plexidev.org/api/UzNMDpe.gif')
		interaction.reply({ embeds: [embed] });
	}

	registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('info')
				.setDescription('Displays the information embed'),
			{ behaviorWhenNotIdentical: RegisterBehavior.Overwrite }
		);
	}
}