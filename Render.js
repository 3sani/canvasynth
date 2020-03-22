$(document).ready(function () {
    sCanvas.width = window.innerWidth;
    sCanvas.height = window.innerHeight;

    document.body.style.backgroundColor = bgColor;
    centreX = innerWidth / 2;
    centreY = innerHeight / 2;

    Oscillator.addOscillator();
    Oscillator.addOscillator(); // TODO REMOVE. Adding second oscillator here just for debugging.
    animate();
});


window.onresize = function () {
    sCanvas.width = window.innerWidth;
    sCanvas.height = window.innerHeight;
    centreX = innerWidth / 2;
    centreY = innerHeight / 2;
}


// The main loop for the whole app. Called as fast as the browser pleases.
function animate() {
    p++;
    if (p >= synthesisPeriod) {
        p = 0;
    }

    //#region placeholder effects for debugging
    s.globalAlpha = fadeOpacity;
    s.fillStyle = fadeColor;
    s.fillRect(0, 0, innerWidth, innerHeight);
    s.globalAlpha = 1;
    s.strokeStyle = "rgb(85, 255, 33)";
    s.beginPath();
    s.arc(
        centreX + oscillators[0].val[p] * 0.475 * innerWidth,
        centreY + oscillators[1].val[p] * 0.475 * innerHeight,
        20, 0, 2 * Math.PI);
    s.stroke();
    //#endregion

    requestAnimationFrame(animate);
}
