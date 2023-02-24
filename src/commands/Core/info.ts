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
			.setDescription(`Community channels is an open-source Discord bot created by **@lorencerri** ([GitHub](https://github.com/lorencerri), originally for the [Hypnospace](https://lorencerri.notion.site/Hypnospace-a51c36d0b3614e82a1426bb9681f0ff6) Discord server. | [Twitter](https://twitter.com/lorencerri))\n\n**Links:**\n[Commands](https://lorencerri.notion.site/Commands-9159d2d30d15429f8b35119ebced6a2c)\n[Documentation](https://lorencerri.notion.site/lorencerri/Community-Channels-75b1c971513c4b429b5071f1357e38f0)\n[Source Code](https://github.com/lorencerri/community-channels)`)
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