const UsernameValidator = {
	validate(username: string) {
		const validation = /^[a-zA-Z0-9_]{2,}[a-zA-Z]+[0-9]*$/
		return validation.test(username)
	},
}

export default UsernameValidator
