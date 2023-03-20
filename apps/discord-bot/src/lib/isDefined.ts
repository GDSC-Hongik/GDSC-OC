/**
 * A function that can be passed to `Array.prototype.filter` function to filter
 * out undefined values with typescript checks.
 */
export default function <T>(argument: T | undefined | null): argument is T {
	return argument !== undefined && argument !== null
}
