import type { ChannelsCache } from "../../types/botCache"
import { botCache, refs } from "."

function cacheChannels(
	key: keyof ChannelsCache,
	channelIDs: string[]
): string[] {
	return (botCache.data.channels[key] = channelIDs)
}

export async function getChannels(
	name: keyof ChannelsCache
): Promise<string[] | undefined> {
	if (botCache.data.channels[name]) return botCache.data.channels[name]

	const channelConfigDoc = await refs.channels.get()
	const channelID = channelConfigDoc.get(name)

	if (channelID) return cacheChannels(name, channelID)

	console.error(
		`Failed to get channel ID of ${name}. Data does not exist in DB.`
	)

	return undefined
}

export async function updateChannels(
	operation: "add" | "remove" | "set",
	name: keyof ChannelsCache,
	channelIDs: string[]
): Promise<string[]> {
	let newChannelIDs: string[] = []

	if (operation === "set") {
		newChannelIDs = channelIDs
	} else {
		const IDSet = new Set(botCache.data.channels[name])

		if (operation === "add")
			for (const channelID of channelIDs) IDSet.add(channelID)

		if (operation === "remove")
			for (const channelID of channelIDs) IDSet.delete(channelID)

		newChannelIDs = Array.from(IDSet)
	}

	refs.channels.set({ [name]: newChannelIDs }, { merge: true })
	return cacheChannels(name, newChannelIDs)
}
