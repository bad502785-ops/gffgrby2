const desert = document.querySelector("#desert");
const horse1 = document.querySelector("#horse1");
const horse2 = document.querySelector("#horse2");
const horse3 = document.querySelector("#horse3");
const horse4 = document.querySelector("#horse4");
const horse5 = document.querySelector("#horse5");
const horse6 = document.querySelector("#horse6");
const finishLine = document.querySelector("#finish-line");
const startBtn = document.querySelector("#start-button");
const stopBtn = document.querySelector("#stop-button");
const resetBtn = document.querySelector("#reset-button");
const explanationText = document.querySelector("#explanation");
let raceInterval = null;
let x1 = 0, x2 = 0, x3 = 0, x4 = 0, x5 = 0, x6 = 0;


function random() {
    return Math.floor(Math.random() * 30);
}

function horseRun() {
    x1 += random();
    x2 += random();
    x3 += random();
    x4 += random();
    x5 += random();
    x6 += random();
    horse1.style.left = x1 + "px";
    horse2.style.left = x2 + "px";
    horse3.style.left = x3 + "px";
    horse4.style.left = x4 + "px";
    horse5.style.left = x5 + "px";
    horse6.style.left = x6 + "px";
}

function leadingHorse() {
    const positions = [x1, x2, x3, x4, x5, x6];
    const maximum = Math.max(...positions);
    const leadingHorseIndex = positions.indexOf(maximum) + 1;
    explanationText.textContent = "Leading horse: " + leadingHorseIndex;
    const finish = finishLine.offsetLeft - horse1.offsetWidth;
    if (maximum >= finish) {
        explanationText.textContent = "Horse " + leadingHorseIndex + " wins!";
        clearInterval(raceInterval);
        raceInterval = null;
    }
}

startBtn.onclick = function () {
    if (raceInterval !== null)
        return; raceInterval = setInterval(() => {
            horseRun();
            leadingHorse();
        }, 300);
};

stopBtn.onclick = function () {
    if (raceInterval !== null) {
        clearInterval(raceInterval);
        raceInterval = null;
    }
};

resetBtn.onclick = function () {
    clearInterval(raceInterval);
    raceInterval = null;
    x1 = x2 = x3 = x4 = x5 = x6 = 0;
    horse1.style.left = horse2.style.left = horse3.style.left
        = horse4.style.left = horse5.style.left = horse6.style.left = "0px";
    explanationText.textContent = "The horses are ready to race";
};
