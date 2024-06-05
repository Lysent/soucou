const difficulty = localStorage.getItem("selectedDifficulty") || "normal";

const stats = {
	easy: {
		player: {
			health: 100,
			regenRate: 60,
			corruptRate: 0.8
		},
		cercey: {
			health: 5
		}
	},
	normal: {
		player: {
			health: 50,
			regenRate: 140,
			corruptRate: 0.5
		},
		cercey: {
			health: 10
		}
	},
	hard: {
		player: {
			health: 35,
			regenRate: 200,
			corruptRate: 0.3
		},
		cercey: {
			health: 15
		}
	},
	nightmare: {
		player: {
			health: 20,
			regenRate: 300,
			corruptRate: 0.2
		},
		cercey: {
			health: 25
		}
	},
	impossible: {
		player: {
			health: 1,
			regenRate: 999,
			corruptRate: 0.01
		},
		cercey: {
			health: 25
		}
	}
}

const currentDifficulty = stats[difficulty];

export default currentDifficulty;