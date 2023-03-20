import { z } from "zod"

// nanoID generated using https://zelark.github.io/nano-id-cc/
export enum Achievements {
	ATTENDANCE_1 = "nbZNJBk1",
	ATTENDANCE_10 = "o3jsK6Os",
	ATTENDANCE_30 = "QBB4SAoz",
	ATTENDANCE_50 = "vz83EI8Q",
	ATTENDANCE_100 = "U1sPZjUy",
	ATTENDANCE_300 = "nPSUDwAf",

	POST_CREATE_1 = "cobEvIJo",
	POST_CREATE_10 = "hRsKpQWC",
	POST_CREATE_30 = "N70S85i0",
	POST_CREATE_50 = "d90jbO6T",
	POST_CREATE_100 = "m5BVFJaw",
}

export const AchievementNames: { [key in Achievements]: string } = {
	[Achievements.ATTENDANCE_1]: "1일 출석",
	[Achievements.ATTENDANCE_10]: "10일 출석",
	[Achievements.ATTENDANCE_30]: "30일 출석",
	[Achievements.ATTENDANCE_50]: "50일 출석",
	[Achievements.ATTENDANCE_100]: "100일 출석",
	[Achievements.ATTENDANCE_300]: "300일 출석",

	[Achievements.POST_CREATE_1]: "정보공유 1번",
	[Achievements.POST_CREATE_10]: "정보공유 10번",
	[Achievements.POST_CREATE_30]: "정보공유 30번",
	[Achievements.POST_CREATE_50]: "정보공유 50번",
	[Achievements.POST_CREATE_100]: "정보공유 100번",
}

export const achievementsSchema = z.nativeEnum(Achievements)
