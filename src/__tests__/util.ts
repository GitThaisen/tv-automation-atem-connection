import { AtemStateUtil } from '../state'

export function createEmptyState () {
	const state = AtemStateUtil.Create()

	// These should be the maximum supported by any device.
	// But they can also be whatever is needed to allow the tests to run without error
	state.info.capabilities = {
		mixEffects: 4,
		sources: 40,
		auxilliaries: 6,
		mixMinusOutputs: 8,
		mediaPlayers: 4,
		serialPorts: 1,
		maxHyperdecks: 4,
		DVEs: 1,
		stingers: 1,
		superSources: 2,
		// talkbackOverSDI: 0,
		downstreamKeyers: 4,
		cameraControl: true,
		advancedChromaKeyers: true
	}
	state.info.mixEffects = [
		{
			keyCount: 4
		},
		{
			keyCount: 4
		},
		{
			keyCount: 4
		},
		{
			keyCount: 4
		}
	]
	state.info.multiviewer = {
		count: 255,
		windowCount: 16
	}

	return state
}
