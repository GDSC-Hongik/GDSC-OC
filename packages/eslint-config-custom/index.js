module.exports = {
	extends: [
		"turbo",
		"prettier",
		"plugin:@typescript-eslint/recommended",
		"eslint:recommended",
	],
	rules: {
		"import/no-anonymous-default-export": "off",
		// https://github.com/typescript-eslint/typescript-eslint/issues/2621#issuecomment-701970389
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": "error",
	},
	env: {
		node: true,
	},
}
