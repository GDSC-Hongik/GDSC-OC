import type { Events } from "@sapphire/framework"
import { Listener } from "@sapphire/framework"
import type {
	MessageReaction,
	PartialMessageReaction,
	PartialUser,
	User,
} from "discord.js"

import { DevRatingEvent, devRatingEvent } from "../lib/devRating"

export class MessageReactionRemoveListener extends Listener<
	typeof Events.MessageReactionRemove
> {
	public async run(
		messageReaction: MessageReaction | PartialMessageReaction,
		user: User | PartialUser
	) {
		await devRatingEvent({
			type: DevRatingEvent.UPVOTE_REMOVE,
			data: [messageReaction, user],
		})
	}
}
