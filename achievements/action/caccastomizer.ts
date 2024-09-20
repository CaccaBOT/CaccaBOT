//@ts-ignore
import { addAchievementToUser } from '../../database'
import { Achievement } from '../../types/Achievement'
import { RawUser } from '../../types/User'

const caccastomizer: Achievement = {
	id: 'CACCASTOMIZER',
	check: function (user: RawUser) {
		addAchievementToUser(user.id, this.id)
	},
}

export default caccastomizer;
