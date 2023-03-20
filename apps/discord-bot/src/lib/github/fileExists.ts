import fetch from "node-fetch"

export default async function (
	username: string,
	repo: string,
	filePath: string
): Promise<boolean> {
	const response = await fetch(
		`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`
	)

	return response.ok
}
