import { container } from '@sapphire/framework';
import { send, } from '@sapphire/plugin-editable-commands';
import { Message, MessageEmbed } from 'discord.js';
import { RandomLoadingMessage } from './constants';
import Jimp from 'jimp'
import path from 'path';

/**
 * Picks a random item from an array
 * @param array The array to pick a random item from
 * @example
 * const randomEntry = pickRandom([1, 2, 3, 4]) // 1
 */
export function pickRandom<T>(array: readonly T[]): T {
	const { length } = array;
	return array[Math.floor(Math.random() * length)];
}

/**
 * Sends a loading message to the current channel
 * @param message The message data for which to send the loading message
 */
export function sendLoadingMessage(message: Message): Promise<typeof message> {
	return send(message, { embeds: [new MessageEmbed().setDescription(pickRandom(RandomLoadingMessage)).setColor('#FF0000')] });
}

/**
 * Gets a message from the URL
 * @param url The url to fetch
 */
export async function getMessageFromUrl(url: String): Promise<any> {
	console.log(`URL Found: ${url}`)
	if (!url) return null
	const { client } = container;
	const parts = url.split('channels')[1].split('/').filter(Boolean);
	if (parts.length !== 3) return null;
	const guild = await client.guilds.fetch(parts[0]);
	if (!guild) return null;
	const channel = await guild.channels.fetch(parts[1]);
	if (!channel || channel.type !== 'GUILD_TEXT') return null;
	return await channel.messages.fetch(parts[2]);
}

/**
 * Generate a list using JIMP
 * @param lines
 */

/**
 * Generate a list using JIMP
 * @param lines
 */
export async function generateList(basePath: String, lines: String[]): Promise<any> {

	const PRIMARY_BACKGROUND_PATH = path.join(__dirname, '../../src/lib/assets/first.png');
	const EXTRA_BACKGROUND_PATH = path.join(__dirname, '../../src/lib/assets/extra.png');

	const font = await Jimp.loadFont(path.join(__dirname, '../../src/lib/assets/hypnoverse.fnt'));
	let bg = await Jimp.read(PRIMARY_BACKGROUND_PATH);
	let count = 0;

	// Initial Page Data
	let x = 60, y = 280, i = 0;

	// First Page
	while (lines.length !== i) {
		bg.print(font, x, y, lines[i]);
		y += 40;
		y += i % 6 ? 0 : 2;
		i++;
		if (i % 41 === 0) break;
	}
	count++;
	await bg.writeAsync(`${basePath}/${count}.png`)

	// Additional Pages
	while (lines.length !== i) {
		bg = await Jimp.read(EXTRA_BACKGROUND_PATH);
		y = 10;
		let ei = 1;
		while (lines.length !== i) {
			if (!lines[i]) break;
			bg.print(font, x, y, lines[i]);
			y += 40;
			i++;
			ei++;
			if (ei % 49 === 0) break;
		}
		count++;
		await bg.writeAsync(`${basePath}/${count}.png`)
	}

	return count;
}