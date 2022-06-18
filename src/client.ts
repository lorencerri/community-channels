import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import { QuickDB } from 'quick.db'

export class Client extends SapphireClient {
	public constructor() {
		super({
			defaultPrefix: '!',
			regexPrefix: /^(hey +)?bot[,! ]/i,
			caseInsensitiveCommands: true,
			logger: {
				level: LogLevel.Debug
			},
			shards: 'auto',
			intents: [
				'GUILDS',
				'GUILD_MEMBERS',
				'GUILD_BANS',
				'GUILD_EMOJIS_AND_STICKERS',
				'GUILD_VOICE_STATES',
				'GUILD_MESSAGES',
				'GUILD_MESSAGE_REACTIONS',
				'DIRECT_MESSAGES',
				'DIRECT_MESSAGE_REACTIONS'
			],
			api: {
				listenOptions: {
					port: 4567
				}
			}
		})
	}

	public override async login(token?: string) {
		container.db = new QuickDB();
		return super.login(token);
	}


}

declare module '@sapphire/pieces' {
	interface Container {
		db: QuickDB;
	}
}