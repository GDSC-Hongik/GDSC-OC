import type { Achievements } from "./achievements"
import type { Activities } from "./activities"
import { Assignment } from "./assignments"
import type { GDSCUser } from "./user"

export interface ChannelsCache {
	infoSharing: string[]
}

export interface EmojisCache {
	upvote: string
}

export default interface BotCache {
	assignments: { [assignmentID: string]: Assignment }
	data: {
		achievementPoints: { [key in Achievements]: number }
		activityPoints: { [key in Activities]: number }
		activityPointsLimit: { [key in Activities]: number }
		channels: ChannelsCache
		emojis: EmojisCache
		rolePoints: { [key: string]: number }
		snowflake2uid: { [key: string]: string }
	}
	users: { [key: string]: GDSCUser }
}
