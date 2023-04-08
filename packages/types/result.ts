export type Success<T> = T extends void
	? { success: true }
	: { success: true; data: T }

export type Fail<U> = U extends void
	? { success: false }
	: { success: false; reason: U }

export type SuccessOrFail<T, U> = Success<T> | Fail<U>
