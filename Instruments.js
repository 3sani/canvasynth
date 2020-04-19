class Instrument {
    constructor(maxWidth, maxHeight, color){
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.centreX = maxWidth / 2;
        this.centreY = maxHeight / 2;
        this.color = color;
    }

    getInstrumentImage(){
        return this.ctx.getImageData(0, 0, this.maxWidth, this.maxHeight);
    }

    drawInstrument(ctx, x, y) {
        ctx.putImageData(this.getInstrumentImage(), x - this.centreX, y - this.centreY);
    }
}

var maxShapeSize = 500;

class Circle extends Instrument {
    constructor(
        radius = 100,
        maxWidth = 500,
        maxHeight = 500,
        color = "white",
    ) {
        super(maxWidth, maxHeight, color);
        this.radius = radius;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = maxShapeSize;
        this.canvas.height = maxShapeSize;

        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(
            maxWidth / 2,
            maxHeight / 2,
            this.radius,
            0,
            tau
        )
        this.ctx.fill();
    }

    updateInstruments() {
        this.ctx.clearRect(0, 0, this.maxWidth, this.maxHeight);
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(
            maxWidth / 2,
            maxHeight / 2,
            this.radius,
            0,
            tau
        )
        this.ctx.fill();
    }
}