import { Events, Listener } from "@sapphire/framework"
import type { Client } from "discord.js"

export class ReadyListener extends Listener<typeof Events.ClientReady> {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: true,
		})
	}

	public async run(client: Client) {
		this.container.logger.info(`${client?.user?.tag} 온라인!`)

		// cache all members so it can detect role changes later
		this.container.logger.info("Caching users...")
		const guilds = await client.guilds.fetch()

		for (const [, oauth2guild] of guilds) {
			const guild = await oauth2guild.fetch()
			await guild.members.fetch()
		}
		this.container.logger.info("Caching users...done!")
	}
}
