import fetch from "node-fetch"

export default async function (
	username: string,
	repo: string,
	filePath: string
): Promise<boolean> {
	const response = await fetch(
		`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`,
		{ headers: { Authorization: process.env.GITHUB_PAT } }
	)

	return response.ok
}
