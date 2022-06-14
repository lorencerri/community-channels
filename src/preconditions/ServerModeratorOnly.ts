import { Command, Precondition } from '@sapphire/framework';

export class ServerModeratorOnlyPrecondition extends Precondition {
	public chatInputRun(interaction: Command.ChatInputInteraction) {
		return this.checkServerModerator(interaction.memberPermissions);
	}

	public contextMenuRun(interaction: Command.ContextMenuInteraction) {
		return this.checkServerModerator(interaction.memberPermissions);
	}

	checkServerModerator(memberPermissions: any) {
		return memberPermissions.has('MANAGE_GUILD') ? this.ok() : this.error({ message: 'This command requires server moderator permissions.' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		ServerModeratorOnly: never;
	}
}
