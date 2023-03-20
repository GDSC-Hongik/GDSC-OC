import { Events, Listener } from "@sapphire/framework"
import type {
	MessageReaction,
	PartialMessageReaction,
	PartialUser,
	User,
} from "discord.js"

import { DevRatingEvent, devRatingEvent } from "../lib/devRating"

export class MessageReactionAddListener extends Listener<
	typeof Events.MessageReactionAdd
> {
	public async run(
		reaction: MessageReaction | PartialMessageReaction,
		user: User | PartialUser
	) {
		await devRatingEvent({
			type: DevRatingEvent.UPVOTE_ADD,
			data: [reaction, user],
		})
	}
}
