import { upvoteAdd, upvoteRemove } from "./parseReaction"
import updateAttendance from "./updateAttendance"
import updateRole from "./updateRole"

export enum DevRatingEvent {
	// 출석 업데이트
	UPDATE_ATTENDANCE,

	// 정보공유 포스트 생성
	POST_CREATE,

	// 정보공유 포스트 삭제
	POST_DELETE,

	// 좋아요가 추가
	UPVOTE_ADD,

	// 좋아요가 제거
	UPVOTE_REMOVE,

	// 역할 정보 갱신
	UPDATE_ROLE,
}

type DevRatingEventPayload =
	| {
			type: DevRatingEvent.UPDATE_ATTENDANCE
			data: Parameters<typeof updateAttendance>
	  }
	| {
			type: DevRatingEvent.UPVOTE_ADD
			data: Parameters<typeof upvoteAdd>
	  }
	| {
			type: DevRatingEvent.UPVOTE_REMOVE
			data: Parameters<typeof upvoteRemove>
	  }
	| {
			type: DevRatingEvent.UPDATE_ROLE
			data: Parameters<typeof updateRole>
	  }

export default async function (payload: DevRatingEventPayload) {
	switch (payload.type) {
		case DevRatingEvent.UPDATE_ATTENDANCE: {
			await updateAttendance(...payload.data)
			break
		}

		case DevRatingEvent.UPVOTE_ADD: {
			await upvoteAdd(...payload.data)
			break
		}

		case DevRatingEvent.UPVOTE_REMOVE: {
			await upvoteRemove(...payload.data)
			break
		}

		case DevRatingEvent.UPDATE_ROLE: {
			await updateRole(...payload.data)
			break
		}

		default: {
			// todo: handle edge case
			break
		}
	}
}
