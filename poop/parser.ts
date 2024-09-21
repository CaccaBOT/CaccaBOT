import { MessageInfo } from "../types/MessageInfo"

const cases = [
	'cacca++',
	'cacca+=1',
	'++cacca',
	'cacca=cacca+1',
	'cacca=cacca+=1',
	'cacca=1+cacca',
	'cacca-=(-1)',
	'cacca|=1',
	'int*ptr=&cacca;(*ptr)++',
	'cacca=~((~cacca)-1)',
]

export function detectPoop(message: MessageInfo | undefined) {
	if (message && message.content) {
		if (cases.includes(message.content.toLowerCase().replaceAll(' ', ''))) {
			return message.sender
		}
	}

	return null
}

module.exports = { detectPoop }
