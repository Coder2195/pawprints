import Ably, { type ChannelOptions } from "ably";

export async function sendAblyEvent(
	channel: string,
	name: string,
	// biome-ignore lint/suspicious/noExplicitAny: message is literally any for ably
	message: any,
	channelOptions?: ChannelOptions,
) {
	const ablyClient = new Ably.Realtime({
		key: process.env.ABLY_ROOT_KEY,
	});

	await ablyClient.channels.get(channel, channelOptions).publish(name, message);
	ablyClient.close();
}
