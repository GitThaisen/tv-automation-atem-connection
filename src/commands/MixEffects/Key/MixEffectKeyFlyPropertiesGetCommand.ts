import { DeserializedCommand } from '../../CommandBase'
import { AtemState, AtemStateUtil, InvalidIdError } from '../../../state'
import { UpstreamKeyerFlySettings } from '../../../state/video/upstreamKeyers'

export class MixEffectKeyFlyPropertiesGetCommand extends DeserializedCommand<UpstreamKeyerFlySettings> {
	public static readonly rawName = 'KeFS'

	public readonly mixEffect: number
	public readonly upstreamKeyerId: number

	constructor (mixEffect: number, upstreamKeyerId: number, properties: UpstreamKeyerFlySettings) {
		super(properties)

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
	}

	public static deserialize (rawCommand: Buffer) {
		const mixEffect = rawCommand.readUInt8(0)
		const upstreamKeyerId = rawCommand.readUInt8(1)
		const properties = {
			isASet: rawCommand.readUInt8(2) === 1,
			isBSet: rawCommand.readUInt8(3) === 1,
			isAtKeyFrame: rawCommand.readUInt8(6),
			runToInfiniteIndex: rawCommand.readUInt8(7)
		}
		return new MixEffectKeyFlyPropertiesGetCommand(mixEffect, upstreamKeyerId, properties)
	}

	public applyToState (state: AtemState) {
		const meInfo = state.info.mixEffects[this.mixEffect]
		if (!meInfo || this.upstreamKeyerId >= meInfo.keyCount) {
			throw new InvalidIdError('UpstreamKeyer', this.mixEffect, this.upstreamKeyerId)
		}

		const mixEffect = AtemStateUtil.getMixEffect(state, this.mixEffect)
		const upstreamKeyer = AtemStateUtil.getUpstreamKeyer(mixEffect, this.upstreamKeyerId)
		upstreamKeyer.flyProperties = {
			...this.properties
		}
		return `video.ME.${this.mixEffect}.upstreamKeyers.${this.upstreamKeyerId}.flyProperties`
	}
}
