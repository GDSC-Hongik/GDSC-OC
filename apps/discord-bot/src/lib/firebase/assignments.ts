import {
	Assignment,
	assignmentSchema,
	defaultAssignment,
} from "../../types/assignments"
import nanoid from "../nanoid"
import { botCache, fixSchema, refs } from "."

export async function listAssignments(
	listClosed = false
): Promise<{ [assignmentID: string]: Assignment }> {
	const querySnapshot = listClosed
		? await refs.assignments.get()
		: await refs.assignments.where("closed", "==", false).get()

	const data: { [assignmentID: string]: Assignment } = {}

	for (const doc of querySnapshot.docs) {
		const assignment = await getAssignment(doc.id)

		if (!assignment) continue

		data[doc.id] = assignment
	}

	return data
}

export async function getAssignment(
	id: string
): Promise<Assignment | undefined> {
	if (botCache.assignments[id]) return botCache.assignments[id]

	const docRef = refs.assignments.doc(id)
	const parseResult = assignmentSchema.safeParse((await docRef.get()).data())
	if (parseResult.success) return (botCache.assignments[id] = parseResult.data)

	console.error(`Failed to get assignment "${id}". Data is invalid.`)

	const fixResult = await fixSchema<Assignment>(docRef, defaultAssignment)

	if (fixResult.success) return fixResult.data

	return undefined
}

export async function createAssignment(
	data: Assignment,
	_id?: string
): Promise<[string, Assignment]> {
	const id = _id ? _id : nanoid()
	return [id, await setAssignment(data, id)]
}

export async function setAssignment(
	data: Partial<Assignment>,
	id: string
): Promise<Assignment> {
	botCache.assignments[id] = {
		...botCache.assignments[id],
		...data,
	}

	await refs.assignments.doc(id).set(botCache.assignments[id], { merge: true })

	return botCache.assignments[id]
}

export async function deleteAssignment(id: string): Promise<boolean> {
	delete botCache.assignments[id]
	await refs.assignments.doc(id).delete()

	return true
}
