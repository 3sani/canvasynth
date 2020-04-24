/**
 * @class
 * @classdesc An oscillator that produces the values of a standard wave.
 * 
 * @property {Object} c
 * HTML5 canvas used for visualising the wave.
 * 
 * @property {Object} ctx
 * HTML5 canvas context for c.
 * 
 * @property {Object} val
 * Float32Array that acts as a lookup table for the oscillators values that are
 * called during synthesisation.
 * 
 * @property {number} type
 * Type of wave. 0 = sine, 1 = square, 2 = triangle, 3 = sawtooth.
 * 
 * @property {number} frequency
 * Number of wave periods per synthesisPeriod.
 * 
 * @property {number} xoffset
 * Amount of x-offset as a fraction of synthesisPeriod.
 * 
 * @property {number} yoffset
 * Amount of y-offset as a total value (-1, 1).
 */
class Oscillator {
    /**
     * @constructor As a side effect generates HTML used in CanvaSynth
     * 
     * @param {number} [type=0]
     * Type of wave. 0 = sine, 1 = square, 2 = triangle, 3 = sawtooth.
     * 
     * @param {number} [frequency=1]
     * Number of wave periods per synthesisation period.
     * 
     * @param {number} [amplitude=1]
     * A number the wave is multiplied by. All waves are trunctated to (-1,1)
     * 
     * @param {number} [xoffset=0]
     * Amount of x-offset as a fraction of synthesisation period.
     * 
     * @param {number} [yoffset=0]
     * Amount of y-offset as a total value (-1, 1).
     */
    constructor(visual=true, type = 0, frequency = 1, xoffset = 0, yoffset = 0, amplitude = 1) {
        this.visual = visual;
        this.val;
        this.type = type;
        this.frequency = frequency;
        this.xoffset = xoffset;
        this.yoffset = yoffset;
        this.amplitude = amplitude;

        if (this.visual){
            this.c = this.constructor.createOscillatorHTML(oscillators.length);
            this.ctx = this.c.getContext('2d');
        }
    }

    /**
     * A wrapper function for the constructor that also initialises the
     * visualiser and val lookup table and adds the new oscillator to the
     * oscillators array.
     */
    static addOscillator() {
        let oscillator = new Oscillator();
        oscillator.updateOscillator();
        oscillators.push(oscillator);
    }

    /**
     * Updates both the val lookup table and the visualiser.
     */
    updateOscillator() {
        this.calculateValueTable();
        if (this.visual) this.drawOscillatorVisualiser();
    }

    /**
     * Creates HTML elements for the oscillator.
     * Completely dependant on cloning them from the CanvaSynth HTML document.
     * 
     * @param {number} i
     * The index for the oscillator.
     */
    static createOscillatorHTML(i) {
        let clone =
            $('#OSCILLATOR_TEMPLATE>div').clone(true).appendTo('#oscillators');

        clone.find('[osc="-1"]').attr("osc", i);
        clone.find('[module="-1"]').attr("module", "o" + i);
        clone.find('.moduleLabel').html("oscillator " + i);
        return clone.find('.visualiser')[0];
    }

    /**
     * Updates the full value table of an oscillator
     */
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
    * All functions are defined to look like they are in the following graphs
    * https://upload.wikimedia.org/wikipedia/commons/7/77/Waveforms.svg
    * Namely in where the period starts.
    * 
    * This done just because it seems quite standard and also makese sense.
    * (all approxiamte a normal sine)
    */

    /**
     * Calculates the value table val for values of a sine wave oscillator.
     */
    sineValues() {
        this.val = new Float32Array(synthesisPeriod);
        let f = this.frequency;
        let a = this.amplitude;
        let x = this.xoffset;
        let y = this.yoffset;

        for (let i = 0; i < synthesisPeriod; i++) {
            this.val[i] = Math.min(1, Math.max(-1, // Clamps values to (-1, 1)
                a * Math.sin(tau * ((f * i) / synthesisPeriod + x)) + y
            ));
        }
    }

    /**
     * Calculates the value table val for values of a square wave oscillator.
     */
    squareValues() {
        this.val = new Float32Array(synthesisPeriod);
        let f = this.frequency;
        let a = this.amplitude;
        let x = (this.xoffset + 0.5) * synthesisPeriod;
        let y = this.yoffset;

        // Value returned if the square wave is positive.
        let positive =
            Math.min(1, Math.max(-1, Math.min(1, Math.max(-1, a)) + y));

        // Value returned if the square wave is negative.
        let negative =
            Math.min(1, Math.max(-1, -Math.min(1, Math.max(-1, a)) + y));

        let n = 0.5 * synthesisPeriod; // Combines these for the slightest

        for (let i = 0; i < synthesisPeriod; i++) {
            this.val[i] =
                ((i + x) * f) % synthesisPeriod - n >= 0 ? positive : negative;
        }
    }

    /**
     * Calculates the value table val for values of a triangle wave oscillator.
     */
    triValues() {
        this.val = new Float32Array(synthesisPeriod);
        let f = this.frequency;
        let a = this.amplitude * 2;
        let x = (this.xoffset + 0.75) * synthesisPeriod;
        let y = this.yoffset;

        for (let i = 0; i < synthesisPeriod; i++) {
            this.val[i] = Math.min(1, Math.max(-1, // Clamps values to (-1, 1)
                a * (Math.abs(2 * (((i + x) * f) % synthesisPeriod)
                    / synthesisPeriod - 1) - 0.5) + y
            ));
        }
    }

    /**
     * Calculates the value table val for values of a sawtooth wave oscillator.
     */
    sawValues() {
        this.val = new Float32Array(synthesisPeriod);
        let f = this.frequency;
        let a = this.amplitude;
        let x = (this.xoffset + 0.5) * synthesisPeriod;
        let y = this.yoffset;

        for (let i = 0; i < synthesisPeriod; i++) {
            this.val[i] = Math.min(1, Math.max(-1, // Clamps values to (-1, 1)
                a * (2 * (((i + x) * f) % synthesisPeriod) / synthesisPeriod - 1) + y
            ));
        }
    }
    //#endregion


    /**
     * Renders the visualiser of this oscillator.
     */
    drawOscillatorVisualiser() {
        let visualiserHeight = this.c.height;

        // Limit the drawable height to give 1px room at top and bottom.
        // (otherwise the top of the wave gets cut by 0.5px)
        let drawableHeight = visualiserHeight - 4;

        let visualiserWidth = this.c.width;

        // HTML canvas set up
        this.ctx.clearRect(0, 0, this.c.width, visualiserHeight);
        this.ctx.beginPath();
        this.ctx.strokeStyle = waveColor;
        this.ctx.lineWidth = 1;

        // Move to the starting point of the visualiser
        this.ctx.moveTo(
            0,
            -drawableHeight / 2 * this.val[0] + visualiserHeight / 2
        );

        // Draw and move the wave as a sequence of lines
        for (let i = 1; i < synthesisPeriod; i++) {
            this.ctx.lineTo(
                i / synthesisPeriod * visualiserWidth,
                -drawableHeight / 2 * this.val[i] + visualiserHeight / 2
            );

            this.ctx.moveTo(
                i / synthesisPeriod * visualiserWidth,
                -drawableHeight / 2 * this.val[i] + visualiserHeight / 2
            );
        }

        // Draw the last line segment of the visualiser
        this.ctx.lineTo(
            visualiserWidth,
            -drawableHeight / 2 * this.val[0] + visualiserHeight / 2
        );

        this.ctx.stroke();
    }
}
