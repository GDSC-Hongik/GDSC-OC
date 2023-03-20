import type { Events } from "@sapphire/framework"
import { Listener } from "@sapphire/framework"
import type { Message } from "discord.js"

import { DevRatingEvent, devRatingEvent } from "../lib/devRating"

export class MessageCreateListener extends Listener<
	typeof Events.MessageCreate
> {
	public async run(message: Message) {
		// slash command 사용은 출석 처리 X
		if (!message.author.bot && !message.author.system)
			await devRatingEvent({
				type: DevRatingEvent.UPDATE_ATTENDANCE,
				data: [message.author.id, message.id],
			})
	}
}
