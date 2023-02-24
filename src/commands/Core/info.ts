import { ApplyOptions } from '@sapphire/decorators';
import {
	Command,
	CommandOptions,
	RegisterBehavior,
} from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'info',
	aliases: ['commands'],
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
			.setDescription(`Community channels is an open-soiurce bot created by [@Loren Cerri](https://github.com/lorencerri)\n\n**Commands:** [Link](https://lorencerri.notion.site/Commands-9159d2d30d15429f8b35119ebced6a2c)\n**Documentation:** [Link](https://lorencerri.notion.site/lorencerri/Community-Channels-75b1c971513c4b429b5071f1357e38f0)\n**Source Code:** [GitHub](https://github.com/lorencerri/community-channels)`)
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