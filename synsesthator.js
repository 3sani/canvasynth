const tau = 2 * Math.PI;

var synthesisPeriod = 360;
var p = 0;

var fadeColor = "rgb(0,0,0)";
var fadeOpacity = 0.5;
var bgColor = "black";

var waveColor = "rgb(85, 255, 33)";

var centreX;
var centreY;
var oscillators = [];

// Fullscreens the synthesisation window
var sCanvas = document.querySelector('#synth');
sCanvas.width = window.innerWidth;
sCanvas.height = window.innerHeight;

// Reference to synthesisation context. Used for drawing to output synthesis.
var s = sCanvas.getContext('2d');

window.onresize = function () {
    sCanvas.width = window.innerWidth;
    sCanvas.height = window.innerHeight;
    centreX = innerWidth / 2;
    centreY = innerHeight / 2;
}

$(document).ready(function () {
    document.body.style.backgroundColor = bgColor;
    centreX = innerWidth / 2;
    centreY = innerHeight / 2;
    Oscillator.addOscillator();
    Oscillator.addOscillator(); // TODO REMOVE
    animate();
});




/**
 * @class
 * @classdesc An oscillator that produces the values of a standard wave with arbitrary frequency and offset.
 * 
 * @property {Object} c HTML5 canvas used for visualising the wave.
 * @property {Object} ctx HTML5 canvas context for c.
 * @property {Object} val Float32Array that acts as a lookup table for the oscillators values that are called during synthesisation.
 * @property {number} type Type of wave. 0 = sine, 1 = square, 2 = triangle, 3 = sawtooth.
 * @property {number} frequency Number of wave periods per synthesisPeriod.
 * @property {number} offset Amount of offset as a fraction of synthesisPeriod.
 * @property {string} color Colour associated with oscillator.
 * @property {Object} dependants Array of objects that need to update when this oscillator updates.
 */
class Oscillator {
    /**
     * @constructor As a side effect generates HTML used in CanvaSynth (dependant on CanvaSynth/index.html).
     * 
     * @param {string} [color="white"] Colour associated with oscillator.
     * @param {number} [type=0] Type of wave. 0 = sine, 1 = square, 2 = triangle, 3 = sawtooth.
     * @param {number} [frequency=1] Number of wave periods per synthesisation period.
     * @param {number} [amplitude=1] A number the wave is multiplied by. All waves are trunctated to (-1,1)
     * @param {number} [offset=0] Amount of offset as a fraction of synthesisation period.
     */
    constructor(color = "white", type = 0, frequency = 1, offset = 0, amplitude = 1) {
        this.color = color;
        this.c = this.constructor.createOscillatorHTML(oscillators.length);
        this.ctx = this.c.getContext('2d');
        this.val;
        this.type = type;
        this.frequency = frequency;
        this.offset = offset;
        this.amplitude = amplitude;
        this.dependants = [];
    }

    /**
     * Sort of a wrapper for the constructor that also initialises the visualiser and val lookup table and adds the new oscillator to the oscillators array.
     */
    static addOscillator() {
        let oscillator = new Oscillator(waveColor);
        oscillator.updateOscillator();
        oscillators.push(oscillator);
    }

    /**
     * Updates both the val lookup table and the visualiser.
     */
    updateOscillator() {
        this.calculateValueTable();
        this.drawOscillatorVisualiser();
    }

    /**
     * Creates HTML elements for the oscillator. Completely dependant on cloning them from the CanvaSynth HTML document.
     * 
     * @param {number} i The index for the oscillator. Used to bind HTML controls to oscillators array.
     */
    static createOscillatorHTML(i) {
        let clone = $('#OSCILLATOR_TEMPLATE>div').clone(true).appendTo('#oscillators');
        clone.find('[osc="-1"]').attr("osc", i);
        clone.find('.oscillatorLabel').html("oscillator " + i);
        return clone.find('.visualiser')[0];
    }

    calculateValueTable() {
        switch (this.type) {
            case 0:
                this.sineValues();
                break;
            case 1:
                this.squareValues();
                break;
            case 2:
                this.triValues();
                break;
            case 3:
                this.sawValues();
                break;
        }
    }


    //#region WAVE FUNCTIONS
    /* 
    * Some funky formulas to calculate various wave functions.
    *
    * All functions calculate these values for a specific Oscillator object.
    * 
    * All functions are defined to look like these https://upload.wikimedia.org/wikipedia/commons/7/77/Waveforms.svg namely in where the period starts.
    * This done just because it seems quite standard and also makese sense (all approxiamte a normal sine).
    * 
    * No guarantee that these are the most efficient ways to calculate them, although they have been optimised quite a bit.
    */

    /**
     * Calculates the value table val for values of a sine wave oscillator.
     */
    sineValues() {
        this.val = new Float32Array(synthesisPeriod);
        let frequency = this.frequency;
        let offset = this.offset;
        let amplitude = this.amplitude;

        for (let i = 0; i < synthesisPeriod; i++) {
            this.val[i] = Math.min(1, Math.max(-1, // Clamps values to (-1, 1)
                amplitude * Math.sin(tau * ((frequency * i) / synthesisPeriod + offset))
            ));
        }
    }

    /**
     * Calculates the value table val for values of a square wave oscillator.
     */
    squareValues() {
        this.val = new Float32Array(synthesisPeriod);
        let offset = (this.offset + 0.5) * synthesisPeriod;
        let frequency = this.frequency;
        let amplitude = Math.min(1, Math.max(-1, this.amplitude));
        let normalizer = 0.5 * synthesisPeriod;

        for (let i = 0; i < synthesisPeriod; i++) {
            this.val[i] =
                ((i + offset) * frequency) % synthesisPeriod - normalizer >= 0 ? amplitude : -amplitude
                ;
        }
    }

    /**
     * Calculates the value table val for values of a triangle wave oscillator.
     */
    triValues() {
        this.val = new Float32Array(synthesisPeriod);
        let offset = (this.offset + 0.75) * synthesisPeriod;
        let frequency = this.frequency;
        let amplitude = this.amplitude * 2;

        for (let i = 0; i < synthesisPeriod; i++) {
            this.val[i] = Math.min(1, Math.max(-1, // Clamps values to (-1, 1)
                amplitude * (Math.abs(2 * (((i + offset) * frequency) % synthesisPeriod) / synthesisPeriod - 1) - 0.5)
            ));
        }
    }

    /**
     * Calculates the value table val for values of a sawtooth wave oscillator.
     */
    sawValues() {
        this.val = new Float32Array(synthesisPeriod);
        let offset = (this.offset + 0.5) * synthesisPeriod;
        let frequency = this.frequency;
        let amplitude = this.amplitude;

        for (let i = 0; i < synthesisPeriod; i++) {
            this.val[i] = Math.min(1, Math.max(-1, // Clamps values to (-1, 1)
                amplitude * (2 * (((i + offset) * frequency) % synthesisPeriod) / synthesisPeriod - 1)
            ));
        }
    }
    //#endregion


    /**
     * Renders the associated visualiser of this oscillator.
     */
    drawOscillatorVisualiser() {
        let visualiserHeight = this.c.height;
        let visualiserDrawableHeight = visualiserHeight - 4; // Limit the drawable height to give 1px room at top and bottom (otherwise the top of the wave gets cut by 0.5px)
        let visualiserWidth = this.c.width;

        // HTML canvas set up
        this.ctx.clearRect(0, 0, this.c.width, visualiserHeight);
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 1;

        this.ctx.moveTo(0, -visualiserDrawableHeight / 2 * this.val[0] + visualiserHeight / 2);
        for (let i = 1; i < synthesisPeriod; i++) {
            this.ctx.lineTo(i / synthesisPeriod * visualiserWidth, -visualiserDrawableHeight / 2 * this.val[i] + visualiserHeight / 2);
            this.ctx.moveTo(i / synthesisPeriod * visualiserWidth, -visualiserDrawableHeight / 2 * this.val[i] + visualiserHeight / 2);
        }
        this.ctx.lineTo(visualiserWidth, -visualiserDrawableHeight / 2 * this.val[0] + visualiserHeight / 2);
        this.ctx.stroke();
    }
}



// TODO EFFECTS
//#region




//#endregion




function animate() {
    p++;
    if (p >= synthesisPeriod) {
        p = 0;

        s.clearRect(0, 0, innerWidth, innerHeight);
    }

    requestAnimationFrame(animate);

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
}




//#region input
$('.collapseButton').click(function () {
    oscAttribute = "[osc='" + $(this).attr("osc") + "']";
    $('.visualiser' + oscAttribute + ', .oscillatorParameters' + oscAttribute).toggle();
});

$('.freq').on('input', function () {
    osc = oscillators[parseInt($(this).attr("osc"))];
    osc.frequency = Math.round(Math.pow(1.006932, this.value)); // Just a nice curve, allows for more contol with small values
    osc.updateOscillator();
});

$('.amplitude').on('input', function () {
    osc = oscillators[parseInt($(this).attr("osc"))];
    osc.amplitude = 1 + 0.00001 * Math.sign(this.value) * this.value * this.value;
    osc.updateOscillator();
});

$('.offset').on('input', function () {
    osc = oscillators[parseInt($(this).attr("osc"))];
    osc.offset = this.value / 1000;
    osc.updateOscillator();
});

$('.waveMenu').change(function () {
    osc = oscillators[parseInt($(this).attr("osc"))];
    osc.type = parseInt(this.value);
    osc.updateOscillator();
});

$('#addOscillator').click(function () {
    Oscillator.addOscillator();
    if (oscillators.length >= 10) $(this).hide();
});
//#endregion