import type { Collection, Role } from "discord.js"
import { userMention } from "discord.js"

import { getUser, setUser, snowflake2UID } from "../firebase"

export default async function (
	discordUserID: string,
	rolesCollection: Collection<string, Role>
) {
	const uid = snowflake2UID(discordUserID)
	if (!uid) return logError(discordUserID, "Unregistered user")

	// get all role ids except for "@everyone"
	// tracking all roles in case a role gets points assigned in the future
	const roles: string[] = []
	for (const [, role] of rolesCollection) {
		if (role.name === "@everyone") return
		roles.push(role.id)
	}

	const user = await getUser(uid)
	if (!user) return logError(discordUserID, "Failed to get user data")

	user.roles = roles
	setUser(uid, user)
}

function logError(discordUserID: string, reason: string): void {
	console.error(
		`Failed to update role of discord user "${userMention(
			discordUserID
		)}". ${reason}.`
	)
}
