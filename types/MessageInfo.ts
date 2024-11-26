export type MessageInfo = {
	isInGroup: boolean
	isCommand: boolean
	isSelf: boolean
	content: string
	sender?: string
	group: string
	command: {
		name: string
		args: string[]
		flags: any[]
	}
}
