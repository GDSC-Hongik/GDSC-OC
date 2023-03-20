import type { Auth } from "firebase-admin/auth"
import type {
	CollectionReference,
	DocumentData,
	DocumentReference,
	Firestore,
} from "firebase-admin/firestore"

import { Achievements } from "../../types/achievements"
import { Activities } from "../../types/activities"
import type BotCache from "../../types/botCache"
import {
	createAssignment,
	deleteAssignment,
	getAssignment,
	listAssignments,
	setAssignment,
} from "./assignments"
import { getChannels, updateChannels } from "./channel"
import fixSchema from "./fixSchema"
import initializeFirebase, { initializeDB } from "./initializeFirebase"
import { getRolePoint, setRolePoint } from "./rolePoints"
import {
	createUser,
	CreateUserFailReason,
	getUser,
	setUser,
	setUserDiscordID,
	snowflake2UID,
} from "./user"

export let auth: Auth
export let db: Firestore

export let refs = {
	// documents
	achievementPoints: {} as DocumentReference<DocumentData>,
	activityPoints: {} as DocumentReference<DocumentData>,
	activityPointsLimit: {} as DocumentReference<DocumentData>,
	channels: {} as DocumentReference<DocumentData>,
	emojis: {} as DocumentReference<DocumentData>,
	rolePoints: {} as DocumentReference<DocumentData>,
	snowflake2uid: {} as DocumentReference<DocumentData>,

	// collections
	assignments: {} as CollectionReference<DocumentData>,
	users: {} as CollectionReference<DocumentData>,
}

// These are the default values.
// Whatever is in the database will override these data.
export const botCache: BotCache = {
	assignments: {},
	data: {
		achievementPoints: {
			[Achievements.ATTENDANCE_1]: 5,
			[Achievements.ATTENDANCE_10]: 15,
			[Achievements.ATTENDANCE_30]: 30,
			[Achievements.ATTENDANCE_50]: 50,
			[Achievements.ATTENDANCE_100]: 100,
			[Achievements.ATTENDANCE_300]: 300,

			[Achievements.POST_CREATE_1]: 5,
			[Achievements.POST_CREATE_10]: 15,
			[Achievements.POST_CREATE_30]: 30,
			[Achievements.POST_CREATE_50]: 50,
			[Achievements.POST_CREATE_100]: 100,
		},
		activityPoints: {
			[Activities.ATTENDANCE]: 1,

			[Activities.UPVOTE_RECEIVE]: 1,
			[Activities.UPVOTE_ADD]: 1,

			[Activities.ATTEND_STUDY]: 10,
			[Activities.ATTEND_SEMINAR]: 10,
			[Activities.SEMINAR_SPEAKER]: 15,
		},
		activityPointsLimit: {
			[Activities.ATTENDANCE]: Infinity,

			[Activities.UPVOTE_RECEIVE]: 30,
			[Activities.UPVOTE_ADD]: Infinity,

			[Activities.ATTEND_STUDY]: Infinity,
			[Activities.ATTEND_SEMINAR]: Infinity,
			[Activities.SEMINAR_SPEAKER]: Infinity,
		},
		channels: {
			infoSharing: [],
		},
		emojis: {
			upvote: "<:gdsc:1082385810243993610>",
		},
		rolePoints: {},
		snowflake2uid: {},
	},
	users: {},
}

export function setAuth(newAuth: Auth) {
	auth = newAuth
}

export function setDB(newDB: Firestore) {
	db = newDB
	db.settings({ ignoreUndefinedProperties: true })
}

export function setRefs(newRefs: typeof refs) {
	refs = newRefs
}

export {
	createAssignment,
	createUser,
	CreateUserFailReason,
	deleteAssignment,
	fixSchema,
	getAssignment,
	getChannels,
	getRolePoint,
	getUser,
	initializeDB,
	initializeFirebase,
	listAssignments,
	setAssignment,
	setRolePoint,
	setUser,
	setUserDiscordID,
	snowflake2UID,
	updateChannels,
}
