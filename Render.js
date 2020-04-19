// The main loop for the whole app.
function animate() {
    p++;
    if (p >= synthesisPeriod) {
        p = 0;
    }

    s.globalAlpha = fadeOpacity;
    s.fillStyle = fadeColor;
    s.fillRect(0, 0, innerWidth, innerHeight);
    s.globalAlpha = 1;

    instruments.forEach(instrument => {
        if(instrument.enabled) instrument.drawInstrument(s,p)
    });

    requestAnimationFrame(animate);
}
