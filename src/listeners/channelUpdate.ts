import { Listener } from '@sapphire/framework';
import { updateGUI } from '../lib/utils';

export class ChannelUpdateEvent extends Listener {
	public run(_: any, newChannel: any) {
		updateGUI(newChannel.guild);
	}

}
