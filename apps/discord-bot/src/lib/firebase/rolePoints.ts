import { FieldValue } from "firebase-admin/firestore"

import { botCache, refs } from "."

function cacheRolePoints(roleID: string, point: number): number {
	return (botCache.data.rolePoints[roleID] = point)
}

export async function getRolePoint(
	roleID: string
): Promise<number | undefined> {
	if (botCache.data.rolePoints[roleID]) return botCache.data.rolePoints[roleID]

	const rolePointDoc = await refs.rolePoints.get()
	const rolePointsData = rolePointDoc.data()

	if (!rolePointsData || !rolePointsData[roleID]) return undefined

	return cacheRolePoints(roleID, rolePointsData[roleID])
}

/**
 * Sets devRating points for a discord role.
 * If `point` is falsy (i.e. is 0), the function removes the role from firestore.
 *
 * @param roleID - Discord role snowflake
 * @param point - Points that will be given to
 * @returns
 */
export async function setRolePoint(
	roleID: string,
	point: number
): Promise<number> {
	if (!point) {
		await refs.rolePoints.update({
			[roleID]: FieldValue.delete(),
		})

		delete botCache.data.rolePoints[roleID]

		return 0
	}

	await refs.rolePoints.set({ [roleID]: point }, { merge: true })

	return cacheRolePoints(roleID, point)
}
