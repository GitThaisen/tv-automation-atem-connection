import { DeserializedCommand } from '../../CommandBase'
import { AtemState, AtemStateUtil, InvalidIdError } from '../../../state'
import { UpstreamKeyerFlyKeyframe } from '../../../state/video/upstreamKeyers'

export class MixEffectKeyFlyKeyframeGetCommand extends DeserializedCommand<UpstreamKeyerFlyKeyframe> {
	public static readonly rawName = 'KKFP'

	public readonly mixEffect: number
	public readonly upstreamKeyerId: number
	public readonly keyFrameId: number

	constructor (mixEffect: number, upstreamKeyerId: number, keyFrameId: number, properties: UpstreamKeyerFlyKeyframe) {
		super(properties)

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
		this.keyFrameId = keyFrameId
	}

	public static deserialize (rawCommand: Buffer) {
		const mixEffect = rawCommand.readUInt8(0)
		const upstreamKeyerId = rawCommand.readUInt8(1)
		const keyFrameId = rawCommand.readUInt8(2)
		const properties = {
			keyFrameId: keyFrameId,

			sizeX: rawCommand.readUInt32BE(4),
			sizeY: rawCommand.readUInt32BE(8),

			positionX: rawCommand.readInt32BE(12),
			positionY: rawCommand.readInt32BE(16),
			rotation: rawCommand.readInt32BE(20),

			borderOuterWidth: rawCommand.readUInt16BE(24),
			borderInnerWidth: rawCommand.readUInt16BE(26),
			borderOuterSoftness: rawCommand.readUInt8(28),
			borderInnerSoftness: rawCommand.readUInt8(29),
			borderBevelSoftness: rawCommand.readUInt8(30),
			borderBevelPosition: rawCommand.readUInt8(31),

			borderOpacity: rawCommand.readUInt8(32),
			borderHue: rawCommand.readUInt16BE(34),
			borderSaturation: rawCommand.readUInt16BE(36),
			borderLuma: rawCommand.readUInt16BE(38),

			lightSourceDirection: rawCommand.readUInt16BE(40),
			lightSourceAltitude: rawCommand.readUInt8(42),

			// maskEnabled: rawCommand.readUInt8(43) === 1,
			maskTop: rawCommand.readInt16BE(44),
			maskBottom: rawCommand.readInt16BE(46),
			maskLeft: rawCommand.readInt16BE(48),
			maskRight: rawCommand.readInt16BE(50)
		}

		return new MixEffectKeyFlyKeyframeGetCommand(mixEffect, upstreamKeyerId, keyFrameId, properties)
	}

	public applyToState (state: AtemState) {
		const meInfo = state.info.mixEffects[this.mixEffect]
		if (!meInfo || this.upstreamKeyerId >= meInfo.keyCount) {
			throw new InvalidIdError('UpstreamKeyer', this.mixEffect, this.upstreamKeyerId)
		} else if (this.keyFrameId <= 0 || this.keyFrameId > 2) {
			throw new InvalidIdError('FlyKeyFrame', this.keyFrameId)
		}

		const mixEffect = AtemStateUtil.getMixEffect(state, this.mixEffect)
		const upstreamKeyer = AtemStateUtil.getUpstreamKeyer(mixEffect, this.upstreamKeyerId)
		upstreamKeyer.flyKeyframes[this.properties.keyFrameId] = {
			...this.properties
		}
		return `video.ME.${this.mixEffect}.upstreamKeyers.${this.upstreamKeyerId}.flyKeyframes.${this.properties.keyFrameId}`
	}
}
