import { container, InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { ButtonInteraction } from 'discord.js';
import { updateGUI } from '../../lib/utils';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class JoinInteractionHandler extends InteractionHandler {
	public override async run(interaction: ButtonInteraction) {
		if (!interaction.guild) throw new Error('Sorry, this command can only run in guilds.');

		const id = interaction.customId.split('_')[1];
		if (!id) throw new Error('Invalid channel ID.');
		const categoryIds: String[] = await container.db.get(`categories_${interaction.guild.id}`) || [];

		const channel = await interaction.guild.channels.fetch(id);
		if (!channel) throw new Error("Sorry, I could not find a channel with that ID.")
		if (!channel.parentId) throw new Error("Sorry, that channel is not part of a category.");
		if (!categoryIds.includes(channel.parentId)) throw new Error("Sorry, that channel is not joinable.");

		channel.permissionOverwrites.edit(interaction.user, { VIEW_CHANNEL: true });
		await interaction.reply({ content: `> Successully added you to ${channel.toString()}`, ephemeral: true });

		await updateGUI(interaction.guild);
	}
}