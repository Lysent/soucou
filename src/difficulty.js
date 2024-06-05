const difficulty = localStorage.getItem("selectedDifficulty") || "normal";

const stats = {
	easy: {
		player: {
			health: 80
		},
		cercey: {
			health: 3
		}
	},
	normal: {
		player: {
			health: 50
		},
		cercey: {
			health: 5
		}
	}
}

const currentDifficulty = stats[difficulty];

export default currentDifficulty;