class Effect {
    constructor(){

    }
}

var maxShapeSize = 500;

// TODO PLAN FOR EFFECTS
/* 
 * So I think the end result is that we basically gotta render every frame of an
 * effect right here, including any moves and scales and bullshit like that.
 * If we wanna support having 10+ effects at the same time, the overhead of
 * calculating them all every single frame is  going to be way worse than just taking
 * the hit of having to pre-render them all to memory.
 * After all, we're only working with a memory foorprint of
 * width x height x synthesisPeriod x effectTotal * 4
 * And that's just typed int8Arrays (= pretty damn fast and small).
 */

class Circle extends Effect {
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

    updateEffect() {
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