import { Listener } from '@sapphire/framework';
import { updateGUI } from '../lib/utils';

export class ChannelUpdateEvent extends Listener {
	public run(oldChannel: any, newChannel: any) {
		if (oldChannel.name !== newChannel.name || oldChannel.permissionOverwrites.cache.size !== newChannel.permissionOverwrites.cache.size) {
			updateGUI(newChannel.guild);
		}
	}

}
