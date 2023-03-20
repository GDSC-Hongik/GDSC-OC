import isDefined from "./isDefined"

/**
 * Remove duplicate values
 *
 * @param arr
 * @returns
 */
export default function <T>(arr: (T | undefined | null)[]): T[] {
	return Array.from(new Set(arr)).filter(isDefined)
}
