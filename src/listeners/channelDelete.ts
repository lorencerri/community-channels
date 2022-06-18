import { Listener } from '@sapphire/framework';
import { updateGUI } from '../lib/utils';

export class ChannelDeleteEvent extends Listener {
	public run(channel: any) {
		updateGUI(channel.guild);
	}

}
