"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
const __1 = require("../../..");
class TransitionDVECommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'TDvP';
    }
    updateProps(newProps) {
        this._updateProps(newProps);
    }
    deserialize(rawCommand) {
        this.mixEffect = __1.Util.parseNumberBetween(rawCommand[0], 0, 3);
        this.properties = {
            rate: __1.Util.parseNumberBetween(rawCommand[1], 1, 250),
            logoRate: __1.Util.parseNumberBetween(rawCommand[2], 1, 250),
            style: __1.Util.parseEnum(rawCommand[3], __1.Enums.DVEEffect),
            fillSource: rawCommand[4] << 8 | (rawCommand[5] & 0xff),
            keySource: rawCommand[6] << 8 | (rawCommand[7] & 0xff),
            enableKey: rawCommand[8] === 1,
            preMultiplied: rawCommand[9] === 1,
            clip: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(10), 0, 1000),
            gain: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(12), 0, 1000),
            invertKey: rawCommand[14] === 1,
            reverse: rawCommand[15] === 1,
            flipFlop: rawCommand[16] === 1
        };
    }
    serialize() {
        const rawCommand = 'CTDv';
        const buffer = new Buffer(24);
        buffer.fill(0);
        Buffer.from(rawCommand).copy(buffer, 0);
        buffer.writeUInt16BE(this.flag, 4);
        buffer.writeUInt8(this.mixEffect, 6);
        buffer.writeUInt8(this.properties.rate, 7);
        buffer.writeUInt8(this.properties.logoRate, 8);
        buffer.writeUInt8(this.properties.style, 9);
        buffer.writeUInt16BE(this.properties.fillSource, 10);
        buffer.writeUInt16BE(this.properties.keySource, 12);
        buffer[14] = this.properties.enableKey ? 1 : 0;
        buffer[15] = this.properties.preMultiplied ? 1 : 0;
        buffer.writeUInt16BE(this.properties.clip, 16);
        buffer.writeUInt16BE(this.properties.gain, 18);
        buffer[20] = this.properties.invertKey ? 1 : 0;
        buffer[21] = this.properties.reverse ? 1 : 0;
        buffer[22] = this.properties.flipFlop ? 1 : 0;
        return buffer;
    }
    applyToState(state) {
        const mixEffect = state.video.getMe(this.mixEffect);
        mixEffect.transitionSettings.DVE = Object.assign({}, this.properties);
    }
}
TransitionDVECommand.MaskFlags = {
    rate: 1 << 0,
    logoRate: 1 << 1,
    style: 1 << 2,
    fillSource: 1 << 3,
    keySource: 1 << 4,
    enableKey: 1 << 5,
    preMultiplied: 1 << 6,
    clip: 1 << 7,
    gain: 1 << 8,
    invertKey: 1 << 9,
    reverse: 1 << 10,
    flipFlop: 1 << 11
};
exports.TransitionDVECommand = TransitionDVECommand;
//# sourceMappingURL=TransitionDVECommand.js.map