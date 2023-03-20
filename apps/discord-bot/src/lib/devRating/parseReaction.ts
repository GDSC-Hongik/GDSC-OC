import type {
	MessageReaction,
	PartialMessageReaction,
	PartialUser,
	User,
} from "discord.js"

import { Activities } from "../../types/activities"
import type { GDSCUser } from "../../types/user"
import { botCache, getUser, setUser, snowflake2UID } from "../firebase"
import removeDuplicates from "../removeDuplicates"

interface Args {
	upvoteAdderUID: string
	upvoteAdder: GDSCUser
	upvoteReceiverUID: string
	upvoteReceiver: GDSCUser
}

/**
 * Handles upvote addition.
 * Parameters are the same as "messageReactionAdd" event on discord.
 */
export async function upvoteAdd(
	reaction: MessageReaction | PartialMessageReaction,
	user: User | PartialUser
) {
	// exit if reaction is not the upvote emoji
	if (reaction.emoji.toString() !== botCache.data.emojis.upvote) return

	// parse arguments
	const messageURL = reaction.message.url
	const args = await parseArgs(reaction, user)
	if (!args.success) {
		await reaction.users.remove(user.id)
		return logError(messageURL, args.reason)
	}

	const { upvoteAdderUID, upvoteAdder, upvoteReceiverUID, upvoteReceiver } =
		args.data

	if (messageURL in upvoteAdder.upvotesGiven)
		return logError(messageURL, "User has already upvoted the message")

	// update upvote adder data

	upvoteAdder.points += botCache.data.activityPoints[Activities.UPVOTE_ADD]
	upvoteAdder.upvotesGiven[messageURL] = reaction.emoji.toString()
	setUser(upvoteAdderUID, upvoteAdder)

	// update upvote receiver data

	upvoteReceiver.upvotesReceived[messageURL] = removeDuplicates([
		// upvoteReceiver.upvotesReceived[messageURL] being undefined causes error
		// during runtime
		...(upvoteReceiver.upvotesReceived[messageURL] || []),
		user.id,
	])
	// add points to upvote receiver only if doing so will not go over the set limit
	if (
		(upvoteReceiver.upvotesReceived[messageURL].length + 1) *
			botCache.data.activityPoints[Activities.UPVOTE_RECEIVE] <=
		botCache.data.activityPointsLimit[Activities.UPVOTE_RECEIVE]
	)
		upvoteReceiver.points +=
			botCache.data.activityPoints[Activities.UPVOTE_RECEIVE]

	setUser(upvoteReceiverUID, upvoteReceiver)
}

/**
 * Handles upvote removal.
 * Parameters are the same as "messageReactionRemove" event on discord.
 */
export async function upvoteRemove(
	reaction: MessageReaction | PartialMessageReaction,
	user: User | PartialUser
): Promise<void> {
	// not checking if reaction is an upvote emoji so it can handle upvote emoji changes

	// parse arguments
	const messageURL = reaction.message.url
	const args = await parseArgs(reaction, user)
	if (!args.success) return logError(messageURL, args.reason)
	const { upvoteAdderUID, upvoteAdder, upvoteReceiverUID, upvoteReceiver } =
		args.data

	// exit if the removed emoji was not used to upvote the message in the first place
	if (reaction.emoji.toString() !== upvoteAdder.upvotesGiven[messageURL]) return

	// update upvote adder data
	upvoteAdder.points -= botCache.data.activityPoints[Activities.UPVOTE_ADD]
	delete upvoteAdder.upvotesGiven[messageURL]
	setUser(upvoteAdderUID, upvoteAdder)

	// update upvote receiver data
	upvoteReceiver.points -=
		botCache.data.activityPoints[Activities.UPVOTE_RECEIVE]
	delete upvoteReceiver.upvotesReceived[messageURL]
	setUser(upvoteReceiverUID, upvoteReceiver)
}

async function parseArgs(
	reaction: MessageReaction | PartialMessageReaction,
	user: User | PartialUser
): Promise<{ success: true; data: Args } | { success: false; reason: string }> {
	const message = await reaction.message.fetch()

	if (message.author.id === user.id)
		return {
			success: false,
			reason: "Can not upvote/downvote oneself's message",
		}

	const upvoteAdderUID = snowflake2UID(user.id)
	if (!upvoteAdderUID)
		return { success: false, reason: "Failed to retrieve reaction owner UID" }

	const upvoteAdder = await getUser(upvoteAdderUID)
	if (!upvoteAdder)
		return { success: false, reason: "Failed to retrieve reaction owner data" }

	const upvoteReceiverUID = snowflake2UID(message.author.id)
	if (!upvoteReceiverUID)
		return { success: false, reason: "Failed to retrieve message author UID" }

	const upvoteReceiver = await getUser(upvoteReceiverUID)
	if (!upvoteReceiver)
		return { success: false, reason: "Failed to retrieve message author data" }

	return {
		success: true,
		data: {
			upvoteAdderUID,
			upvoteAdder,
			upvoteReceiverUID,
			upvoteReceiver,
		},
	}
}

function logError(messageURL: string, reason: string): void {
	console.error(`Failed to add upvote to ${messageURL}. ${reason}.`)
}
