import { Events, Listener } from "@sapphire/framework"
import type { Role } from "discord.js"

import { botCache, setRolePoint } from "../lib/firebase"

export class ReadyListener extends Listener<typeof Events.GuildRoleDelete> {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: true,
		})
	}

	public async run(role: Role) {
		if (botCache.data.rolePoints[role.id]) setRolePoint(role.id, 0)
	}
}
