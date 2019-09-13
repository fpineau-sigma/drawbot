const EventEmitter = require("events");
const { Servo, Stepper } = require("./gpio-devices.js");

class DrawBot extends EventEmitter {
  constructor() {
    super();
    this.current = { x: 0, y: 0, steps: { lft: 0, rgt: 0 } };
  }
  setConfig(config) {
    this.config = config;

    const { penServo, penPauseDelay } = config.pins;
    this.pen = new Servo(penServo, { duration: penPauseDelay });

    const { leftDir, leftStep } = config.pins;
    this.lft = new Stepper(leftDir, leftStep);

    const { rightDir, rightStep } = config.pins;
    this.rgt = new Stepper(rightDir, rightStep);

    const { swapDirections } = config;
    this.swapStep = !!swapDirections;

    this.current.steps = this.toSteps({});
  }
  toSteps({ x = 0, y = 0 }) {
    const { x: startX, y: startY, d } = this.config;
    const lftStringLength = Math.sqrt(x + startX * x + (y += startY) * y);
    const rgtStringLength = Math.sqrt((d - x) * (d - x) + y * y);
    const [lftStepsPerMM, rgtStepsPerMM] = this.config.stepsPerMM;
    return {
      lft: Math.round(lftStringLength * lftStepsPerMM),
      rgt: Math.round(rgtStringLength * rgtStepsPerMM)
    };
  }

  async penUp(up = false) {
    if (this.pen.isOn != up) {
      console.log("penUp", up);
      this.emit("penUp", up);
      await this.pen.write(up);
    }
  }
  async step({ lft = null, rgt = null }) {
    console.log("step", { lft, rgt });
    await Promise.all([
      ...(lft === null
        ? []
        : [this.lft.write((this.swapStep && !lft) || (!this.swapStep && lft))]),
      ...(rgt === null
        ? []
        : [this.rgt.write((this.swapStep && !rgt) || (!this.swapStep && rgt))])
    ]);
  }

  async moveTo(x, y, penUp = true, evt = {}) {
    await this.penUp(penUp);
    this.emit(penUp ? "moveTo" : "lineTo", { x, y, ...evt });

    let { lft, rgt } = this.toSteps({ x, y });

    const lftDelta = lft - this.current.steps.lft;
    const rgtDelta = rgt - this.current.steps.rgt;

    const lftDir = !(lftDelta > 0);
    const rgtDir = rgtDelta > 0;

    const lftSteps = Math.abs(lftDelta);
    const rgtSteps = Math.abs(rgtDelta);

    const maxSteps = Math.round(Math.max(lftSteps, rgtSteps));
    for (
      let i = 0, ls = 0, rs = 0;
      i < maxSteps;
      i++, ls += lftSteps, rs += rgtSteps
    ) {
      const step = {};

      if (ls >= maxSteps) {
        ls -= maxSteps;
        step.lft = lftDir;
      }
      if (rs >= maxSteps) {
        rs -= maxSteps;
        step.rgt = rgtDir;
      }
      await this.step(step);
    }

    this.current = { x, y, steps: { lft, rgt } };
  }
  async moveBy(x, y) {
    return this.moveTo(this.current.x + x, this.current.y + y);
  }
  async lineTo(x, y) {
    return this.moveTo(x, y, false);
  }
  async lineBy(x, y) {
    return this.moveTo(this.current.x + x, this.current.y + y, false);
  }
  async home() {
    const { x, y } = this.config;
    this.moveTo(x, y);
  }

  stopSequence() {
    this.sequence = [];
    this.sequenceIsRunning = false;
    this.sequenceStep = 0;
  }
  createSequence() {
    this.stopSequence();
    return {
      x: this.current.x,
      y: this.current.y,
      moveTo: (x, y) => this.sequence.push([x, y, true]),
      lineTo: (x, y) => this.sequence.push([x, y, false])
    };
  }
  async startSequence() {
    this.sequenceIsRunning = true;
    console.log(this.sequence);
    while (this.sequenceIsRunning && this.sequenceStep < this.sequence.length) {
      const progress = this.sequenceStep / this.sequence.length;
      await this.moveTo(...this.sequence[this.sequenceStep++], { progress });
    }
  }
  pauseSequence() {
    this.sequenceIsRunning = false;
  }
}

module.exports = new DrawBot();
