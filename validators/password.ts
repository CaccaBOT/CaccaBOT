const PasswordValidator = {
	validate(password: string) {
		if (password != null && password.length > 3) {
			return true
		}
	},
}

export default PasswordValidator
