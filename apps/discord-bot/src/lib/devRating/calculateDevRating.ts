import { devRating2Tier, Tier, tierSchema } from "../../types/tier"
import { GDSCUser } from "../../types/user"
import { botCache } from "../firebase"

/**
 * Calculates devRating of a user.
 * devRating = (role based points) + (badge points) + (XP points * x)
 *   where x = 1 as of now
 */
export default async function (
	user: GDSCUser
): Promise<{ points: number; tier: Tier }> {
	const rolePoints = calculateRolePoints(user)
	const achievementPoints = calculateAchievementPoints(user)

	const points = rolePoints + achievementPoints + user.points * 1
	const tier = calculateTier(points)

	return {
		points,
		tier,
	}
}

function calculateRolePoints(user: GDSCUser): number {
	let rolePoints = 0

	for (const role of user.roles)
		if (typeof botCache.data.rolePoints[role] === "number")
			rolePoints += botCache.data.rolePoints[role]

	return rolePoints
}

function calculateAchievementPoints(user: GDSCUser): number {
	let achievementPoints = 0

	for (const achievement of user.achievements)
		if (typeof botCache.data.achievementPoints[achievement] === "number")
			achievementPoints += botCache.data.achievementPoints[achievement]

	return achievementPoints
}

function calculateTier(points: number): Tier {
	if (points > devRating2Tier.V) return tierSchema.enum.V
	if (points > devRating2Tier.IV) return tierSchema.enum.IV
	if (points > devRating2Tier.III) return tierSchema.enum.III
	if (points > devRating2Tier.II) return tierSchema.enum.II
	if (points > devRating2Tier.I) return tierSchema.enum.I

	return tierSchema.enum.UNRANKED
}
