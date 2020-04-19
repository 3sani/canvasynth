class Instrument {
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

class Circle extends Instrument {
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