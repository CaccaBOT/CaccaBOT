const UsernameValidator = {
  validate(username: string) {
    const validation = /^[a-zA-Z0-9_.]{3,12}$/
    return validation.test(username)
  }
}

export default UsernameValidator
