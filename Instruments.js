/**
 * @file
 * Visual "instruments" that take as inputs values computed by the oscillators and
 * give as outputs actual shapes to be rendered.
 */

/**
 * @class 
 * @classdesc
 * An abstract "visual instrument". Draws shapes etc.
 * 
 * @property {String} name
 * Name of the instrument. Used for UI.
 * 
 * @property {String} color
 * Color in a format that HTML canvas accepts, such as "rgb(255, 255, 255)".
 * 
 * @property {Object} xOsc
 * Oscillator that defines the instrument's render position on the x-axis.
 * 
 * @property {Object} yOsc
 * Oscillator that defines the instrument's render position on the y-axis.
 * 
 * @property {Object} alphaOsc
 * Oscillator that defines the instrument's opacity.
 * Can also be set to "constant" to have the oscillator be constantly opaque.
 * 
 * @property {boolean} enabled
 * Whether or not this instrument is enabled and should be drawn.
 * 
 * @property {Number} maxWidth
 * Maximum width the instrument's output can be.
 * 
 * @property {Number} maxHeight 
 * Maximum ehight the instrument's output can be.
 */
class Instrument {
    /**
    * @constructor
    * 
    * @property {String} name
    * Name of the instrument. Used for UI.
    * 
    * @property {String} color
    * Color in a format that HTML canvas accepts, such as "rgb(255, 255, 255)".
    * 
    * @property {Object} xOsc
    * Oscillator that defines the instrument's render position on the x-axis.
    * 
    * @property {Object} yOsc
    * Oscillator that defines the instrument's render position on the y-axis.
    * 
    * @property {Object} alphaOsc
    * Oscillator that defines the instrument's opacity.
    * Can also be set to "constant" to have the oscillator be constantly opaque.
    * 
    * @property {boolean} enabled
    * Whether or not this instrument is enabled and should be drawn.
    * 
    * @property {Number} maxWidth
    * Maximum width the instrument's output can be.
    * 
    * @property {Number} maxHeight 
    * Maximum ehight the instrument's output can be.
    */
    constructor(name, color, xOsc, yOsc, alphaOsc, enabled, maxWidth, maxHeight){
        this.name = name;
        this.color = color;
        this.xOsc = xOsc;
        this.yOsc = yOsc;
        this.alphaOsc = alphaOsc;
        this.enabled = enabled;
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
    }

    /**
     * Draws the instrument onto a specific graphics context at a point in time.
     * 
     * @param {Object} ctx
     * The HTML canvas graphics context the isntrument's output should be drawn onto.
     *  
     * @param {Number} frame
     * The frame number when to draw (at which point oscillator values are gotten).
     */
    drawInstrument(ctx, frame) {
        let xPos = oscillators[this.xOsc].val[frame];
        let yPos = oscillators[this.yOsc].val[frame];
        
        if (this.alphaOsc != "constant"){
            ctx.globalAlpha = (oscillators[this.alphaOsc].val[frame] + 1) / 2;
        }

        ctx.drawImage(
            this.ctx.canvas, 
            ((1 + xPos) * centreX -this.maxHeight/2),
            ((1 + yPos) * centreY -this.maxHeight/2),
        );

        ctx.globalAlpha = 1;
    }
}

/**
 * @class
 * @classdesc An instrument that copies a coloured circle onto a canvas.
 * 
 * @extends Instrument
 */
class Circle extends Instrument {
    /**
    * @constructor
    * 
    * @property {String} [name="circle"]
    * Name of the instrument. Used for UI.
    * 
    * @property {String} [color="white"]
    * Color in a format that HTML canvas accepts, such as "rgb(255, 255, 255)".
    * 
    * @property {Object} [xOsc=0]
    * Oscillator that defines the instrument's render position on the x-axis.
    * 
    * @property {Object} [yOsc=0]
    * Oscillator that defines the instrument's render position on the y-axis.
    * 
    * @property {Object} [alphaOsc="constant"]
    * Oscillator that defines the instrument's opacity.
    * Can also be set to "constant" to have the oscillator be constantly opaque.
    * 
    * @property {boolean} [enabled=true]
    * Whether or not this instrument is enabled and should be drawn.
    * 
    * @property {Number} [maxWidth=500]
    * Maximum width the instrument's output can be.
    * 
    * @property {Number} [maxHeight=500]
    * Maximum ehight the instrument's output can be.
    */
    constructor(
        name = "circle",
        color = "white",
        xOsc = 0,
        yOsc = 0,
        alphaOsc = "constant",
        enabled = true,
        radius = 25,
        maxWidth = 500,
        maxHeight = 500,
    ) {
        super(name, color, xOsc, yOsc, alphaOsc, enabled, maxWidth, maxHeight);
        this.constructor.createCircleHTML(instruments.length, name, color);
        this.radius = radius;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = maxWidth;
        this.canvas.height = maxHeight;

        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(
            maxWidth / 2,
            maxHeight / 2,
            this.radius,
            0,
            tau
        );

        this.ctx.fill();
    }

    /**
     * A wrapper function for the constructor that also initialises the
     * visualiser and adds the instrument to the instruments array.
     * 
     * @param {String} name
     * Name for the circle.
     * 
     * @param {String} color
     * Color of the circle.
     */
    static addCircle(name, color) {
        let instrument = new Circle(name, color);
        instruments.push(instrument);
    }

    /**
     * Creates HTML elements for the circle instrument.
     * Completely dependant on cloning them from the CanvaSynth HTML document.
     * 
     * @param {number} i
     * The index for the instrument.
     * 
     * @param {String} name
     * Name of the circle on the HTML title.
     * 
     * @param {String} color
     * Color of the circle instrument icon.
     */
    static createCircleHTML(i, name, color) {
        let clone =
            $('#INSTRUMENT_TEMPLATE>div').clone(true).appendTo('#instruments');

        clone.find('[ins="-1"]').attr("ins", i);
        clone.find('[module="-1"]').attr("module", "i" + i);
        clone.find('.moduleLabel').html(name);

        // Draw instrument thumbnail on visualiser
        let vctx = clone.find('.visualiser')[0].getContext('2d')

        vctx.fillStyle = color;
        vctx.beginPath();
        vctx.arc(
            72,
            72,
            50,
            0,
            tau
        );

        vctx.fill();
    }
}