import { container } from '@sapphire/framework';
import { send, } from '@sapphire/plugin-editable-commands';
import { Guild, Message, MessageEmbed } from 'discord.js';
import { RandomLoadingMessage } from './constants';
import joinImages from 'join-images';
import Jimp from 'jimp'
import path, { join } from 'path';
import { randomBytes } from 'crypto';

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

export async function getAllJoinableChannels(guild: Guild): Promise<any> {
	const ids: String[] = await container.db.get(`categories_${guild.id}`) || [];
	if (ids.length === 0) return [];
	const channels = await guild.channels.fetch();
	return channels;
}


/**
 * Generate a list using JIMP
 * @param lines
 */

export async function updateGUI(guild: Guild): Promise<any> {

	// Fetch the joinable channels
	const ids: String[] = await container.db.get(`categories_${guild.id}`) || [];
	const channels = await guild.channels.fetch();
	const categories = channels.filter(c => c.type === 'GUILD_CATEGORY' && ids.includes(c.id));

	// Generate the channel list text
	const channelList = [];
	for (const [_, category] of categories.entries()) {
		if (category.type !== 'GUILD_CATEGORY') continue;
		channelList.push(`<-----  ${category.name}  ----->`);
		for (const [_, channel] of category.children.entries()) {
			channelList.push([channel.name, channel.members.size.toLocaleString("en-US")]);
		}
	}

	// Create the output text
	const list = [
		`Welcome to ${guild.name}!`,
		`Here's all you need to surf the ${guild.name} Highway:`,
		'',
		'Want to join a page? Use the command:',
		'/join <channel name>',
		'',
		'To leave, use the command:',
		'/leave <channel name>',
		'',
		'',
		...channelList
	];

	// Generate the images
	const pageCount = await generateList(`./files/${guild.id}`, list);

	// Update the original GUI message
	const url: String = await container.db.get(`gui_${guild.id}`) || '';
	const message = await getMessageFromUrl(url);
	if (!message) throw new Error('No message found!');

	let reply = '';
	for (let i = 0; i < pageCount; i++) {
		const randomString = `r=${randomBytes(2).toString('hex')}`;
		reply += `https://community.plexidev.org/gui/${guild.id}/${i}.png?${randomString}`;
	}
	message.edit(reply);

	return true;
}

/**
 * TODO: Rewrite
 * Generate a list using JIMP
 * @param lines
 */
export async function generateList(basePath: string, lines: (string | string[])[]): Promise<any> {

	const PRIMARY_BACKGROUND_PATH = path.join(__dirname, '../../src/lib/assets/first.png');
	const EXTRA_BACKGROUND_PATH = path.join(__dirname, '../../src/lib/assets/extra.png');

	const font = await Jimp.loadFont(path.join(__dirname, '../../src/lib/assets/hypnoverse.fnt'));
	let bg = await Jimp.read(PRIMARY_BACKGROUND_PATH);
	let buffers = [];

	// Initial Page Data
	let y = 280, i = 0;

	// First Page
	while (lines.length !== i) {
		if (typeof lines[i] === 'string') bg.print(font, 60, y, lines[i]);
		else {
			bg.print(font, 60, y, lines[i][0]);
			bg.print(font, -60, y, { text: lines[i][1], alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT }, 1200, 60);
		}
		y += 40;
		y += i % 6 ? 0 : 2;
		i++;
		if (i % 41 === 0) break;
	}
	buffers.push(await bg.getBufferAsync(Jimp.MIME_PNG));

	// Additional Pages
	while (lines.length !== i) {
		bg = await Jimp.read(EXTRA_BACKGROUND_PATH);
		y = 10;
		let ei = 1;
		while (lines.length !== i) {
			if (typeof lines[i] === 'string') bg.print(font, 60, y, lines[i]);
			else {
				bg.print(font, 60, y, lines[i][0]);
				bg.print(font, -60, y, { text: lines[i][1], alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT }, 1200, 60);
			}
			y += 40;
			i++;
			ei++;
			if (ei % 49 === 0) break;
		}
		buffers.push(await bg.getBufferAsync(Jimp.MIME_PNG));
	}

	// Combine Images
	let c = 0;
	for (let i = 0; i < buffers.length; i += 2) {
		const b = [buffers[i]];
		if (buffers[i + 1]) b.push(buffers[i + 1]);
		const joined = await joinImages(b, { direction: "horizontal" });
		await joined.toFile(join(basePath, `${c++}.png`));
	}
	return c;
}