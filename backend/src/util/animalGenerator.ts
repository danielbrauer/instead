import adjectives from './adjectives'
import animals from './animals'

export function generateCombination(numAdjectives: number, delimiter: string, capitalizeFirstLetter: boolean) {
	let combination = ''
	const animal = animals[Math.floor(Math.random() * animals.length)]

	for (let i = 0; i < numAdjectives; i++) {
		const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]

		combination += capitalizeFirstLetter ? adjective.charAt(0).toUpperCase() + adjective.slice(1) + delimiter : adjective + delimiter
	}

	combination += capitalizeFirstLetter ? animal.charAt(0).toUpperCase() + animal.slice(1) : animal
	return combination
}