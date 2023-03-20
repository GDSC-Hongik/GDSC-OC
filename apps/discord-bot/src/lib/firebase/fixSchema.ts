import type {
	DocumentData,
	DocumentReference,
	PartialWithFieldValue,
} from "firebase-admin/firestore"

/**
 * Fix user database to fit schema. Can not remove or rename fields yet.
 */
export default async function <T>(
	docRef: DocumentReference,
	defaultData: PartialWithFieldValue<DocumentData>
): Promise<{ success: false } | { success: true; data: T }> {
	const doc = await docRef.get()
	if (!doc) {
		console.error(
			`Failed to fix schema of "${docRef.path}". Failed to get document.`
		)
		return { success: false }
	}

	const data = doc.data()
	if (!data) {
		console.error(
			`Failed to fix schema of "${docRef.path}". Failed to fetch data.`
		)
		return { success: false }
	}

	const newData: PartialWithFieldValue<DocumentData> = {
		...defaultData,
		...data,
	}

	await docRef.set(newData, { merge: true })

	return { success: true, data: newData as T }
}
