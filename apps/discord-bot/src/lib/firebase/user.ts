import { defaultGDSCUser, GDSCUser } from "../../types/user"
import { gdscUserSchema } from "../../types/user"
import { auth, botCache, fixSchema, refs } from "."

export enum CreateUserFailReason {
	USER_NOT_IN_AUTH,
	USER_ALREADY_EXISTS,
}

export async function createUser(
	uid: string,
	data: GDSCUser
): Promise<
	| { success: true; user: GDSCUser }
	| { success: false; reason: CreateUserFailReason }
> {
	// check if user exists in firebase auth
	try {
		await auth.getUser(uid)
	} catch {
		console.error(
			`Failed create user "${uid}" int firestore. User does not exist in firebase auth.`
		)

		return { success: false, reason: CreateUserFailReason.USER_NOT_IN_AUTH }
	}

	const userDocRef = refs.users.doc(uid)

	// check if user already exists
	if ((await userDocRef.get()).exists) {
		console.error(
			`Failed to create user "${uid}" in firestore. User already exists.`
		)

		return { success: false, reason: CreateUserFailReason.USER_ALREADY_EXISTS }
	}

	// create, cache, and return user document
	userDocRef.set(data, { merge: true })
	await setUserDiscordID(uid, data.discordID)
	return {
		success: true,
		user: (await cacheUser(uid, data)) || data,
	}
}

async function cacheUser(
	uid: string,
	user: GDSCUser
): Promise<GDSCUser | undefined> {
	const parseResult = gdscUserSchema.safeParse(user)

	if (parseResult.success) return (botCache.users[uid] = parseResult.data)

	console.error(
		`Fixing invalid user data format at "/users/${uid}": ${JSON.stringify(
			parseResult.error.issues,
			null,
			2
		)}`
	)

	const fixResult = await fixSchema<GDSCUser>(
		refs.users.doc(uid),
		defaultGDSCUser
	)
	if (fixResult.success) return (botCache.users[uid] = fixResult.data)

	return undefined
}

export async function getUser(uid: string): Promise<GDSCUser | undefined> {
	// return cached data if it exists
	if (botCache.users[uid]) return botCache.users[uid]

	// fetch user document from firestore
	const userDoc = await refs.users.doc(uid).get()

	// return user data if it exists
	if (userDoc.exists) return await cacheUser(uid, userDoc.data() as GDSCUser)

	// return undefined if the user does not exist in the DB
	return undefined
}

export async function setUser(uid: string, data: GDSCUser): Promise<void> {
	// fetch user document from firestore
	const userDoc = await refs.users.doc(uid).get()

	if (!userDoc)
		return console.error(
			`Failed to run setUser on "${uid}". Failed to get user document.`
		)

	if (!userDoc)
		return console.error(
			`Failed to run setUser on "${uid}". Document does not exist.`
		)

	userDoc.ref.set(data, { merge: true })
	cacheUser(uid, data)
}

/**
 * Fetch a firebase user's UID associated with the given discord snowflake
 */
export function snowflake2UID(
	discordID: string | undefined | null
): string | undefined {
	if (!discordID) return undefined

	return botCache.data.snowflake2uid[discordID]
}

/**
 * Associates a discord user ID with a firebase user UID
 */
export async function setUserDiscordID(uid: string, discordSnowflake: string) {
	await refs.snowflake2uid.set({ [discordSnowflake]: uid }, { merge: true })
	botCache.data.snowflake2uid[discordSnowflake] = uid
}
