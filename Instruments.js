class Instrument {
    constructor(){

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
        super();
        this.radius = radius;
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.x = maxWidth / 2;
        this.y = maxHeight / 2;
        this.color = color;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = maxShapeSize;
        this.canvas.height = maxShapeSize;

        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            tau
        )
        this.ctx.fill();
    }

    getImageData(){
        return this.ctx.getImageData(0, 0, this.maxWidth, this.maxHeight);
    }

    updateInstruments() {
        this.ctx.clearRect(0, 0, this.maxWidth, this.maxHeight);
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            tau
        )
        this.ctx.fill();
    }
}