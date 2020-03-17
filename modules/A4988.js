//goal is to create a function that varies the speed based on the steps in order to have the motors finish at the same time
// or maybe create a function with already calculated speed/steps/motorpin as parameters and execute different instances for every motor

const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;

const stepPinL = 13;                                        //left Motor step pin
const stepPinR = 19;

const dirPinL = 5;                                         //left Motor direction pin
const dirPinR = 6;

const moveDirL = 0;                                        //left Motor direction
const moveDirR = 1;

const speedL = 200;                                        //this actally is a usDelay - so smaller is faster
const speedR = 200;

// Stepper has 200 steps per revolution and is set to 1/8 steps. 
// so one revolution would be 200x8
var stepsL = 200 * 8; // 1 turn -> 
var stepsR = 200 * 8;

const stepL = new Gpio(stepPinL, { mode: Gpio.OUTPUT });    //prepare pin output
const stepR = new Gpio(stepPinR, { mode: Gpio.OUTPUT });
const dirL = new Gpio(dirPinL, { mode: Gpio.OUTPUT });      //prepare pin output
const dirR = new Gpio(dirPinR, { mode: Gpio.OUTPUT });

stepL.digitalWrite(0);                                    // pin ro low
stepR.digitalWrite(0);
dirL.digitalWrite(moveDirL);
dirR.digitalWrite(moveDirR);

pigpio.waveClear();                                       // clear all defined waves

let leftWaveForm = [];
let rightWaveForm = [];

for (let x = 0; x < 2; x++) {                             // define wave (easy here just ONE on off pulse with delay)
    if (x % 2 === 0) {
        leftWaveForm.push({ gpioOn: stepPinL, gpioOff: 0, usDelay: speedL });
    } else {
        leftWaveForm.push({ gpioOn: 0, gpioOff: stepPinL, usDelay: speedL });
    }
}

pigpio.waveAddGeneric(leftWaveForm);
let leftWaveId = pigpio.waveCreate();

for (let x = 0; x < 2; x++) {
    if (x % 2 === 0) {
        rightWaveForm.push({ gpioOn: stepPinR, gpioOff: 0, usDelay: speedR });
    } else {
        rightWaveForm.push({ gpioOn: 0, gpioOff: stepPinR, usDelay: speedR });
    }
}

pigpio.waveAddGeneric(rightWaveForm);
let rightWaveId = pigpio.waveCreate();

//if(firstWaveId >= 0){
for (let i = 0; i < stepsL; i++) {
    pigpio.waveTxSend(leftWaveId, pigpio.WAVE_MODE_ONE_SHOT);
    while (pigpio.waveTxBusy()) { }
}
//}

//if(secondWaveId >= 0){
for (let i = 0; i < stepsR; i++) {
    pigpio.waveTxSend(rightWaveId, pigpio.WAVE_MODE_ONE_SHOT);
    while (pigpio.waveTxBusy()) { }
}
//}


pigpio.waveDelete(leftWaveId);
pigpio.waveDelete(rightWaveId);
