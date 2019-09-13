const IS_PI = require("detect-rpi")();
const Gpio = IS_PI ? require("pigpio").Gpio : null;

class GpioWrapper {
  constructor({ pin, output = false, input = false }) {
    this.gpio =
      Gpio === null
        ? null
        : new Gpio(pin, {
            mode: output ? Gpio.OUTPUT : input ? Gpio.INPUT : undefined
          });
  }
  servoWrite(value) {
    if (this.gpio !== null) {
      this.gpio.servoWrite(value);
    }
  }
  digitalWrite(value) {
    if (this.gpio !== null) {
      this.gpio.digitalWrite(value);
    }
  }
}

class Servo extends GpioWrapper {
  constructor(pin, { min = 544, max = 2400, duration = 200 } = {}) {
    super({ pin, output: true });
    this.onValue = min;
    this.offValue = min + Math.floor((max - min) * 0.35);
    this.duration = duration;
    this.isOn = false;
  }
  async write(on = false, duration = this.duration) {
    if (this.isOn !== !!on) {
      this.isOn = !this.isOn;
      return new Promise(resolve => {
        this.servoWrite(this.isOn ? this.onValue : this.offValue);
        setTimeout(() => resolve(), duration);
      });
    }
  }
}

class Stepper {
  constructor(dirPin, stepPin, { duration = 1 } = {}) {
    this.dir = new GpioWrapper({ pin: dirPin, output: true });
    this.step = new GpioWrapper({ pin: stepPin, output: true });
    this.duration = duration;
  }
  async write(forward = false, duration = this.duration) {
    return new Promise(resolve => {
      this.dir.digitalWrite(forward ? 1 : 0);
      this.step.digitalWrite(1);
      setTimeout(() => {
        this.step.digitalWrite(0);
        resolve();
      }, duration);
    });
  }
}

module.exports = { Servo, Stepper };
