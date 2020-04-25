/**
 * @file
 * Global constants and variables for the standard browser environment of the app.
 * Contains document.ready for initialisation.
 */

/**
 * Mathematical constant tau = 2 * pi.
 * @type {Number}
 */
const tau = 2 * Math.PI;

/**
 * Number of HTML5 canvas frames before the synthesisation loops.
 * @type {number}
 */
var synthesisPeriod = 360;

/**
 * Framecounter for HTML5 canvas frames.
 * @type {number}
 */
var p = 0;

/**
 * How much the previous frame is faded out on the synthesisation canvas.
 * @type {Number}
 */
var fadeOpacity = 0.25;

/**
 * What colour previous frames on the synthesisation canvas are faded with.
 * @type {String}
 */
var fadeColor = "rgb(0,0,0)";

/**
 * The page background color.
 * @type {String}
 */
var bgColor = "black";

/**
 * The colour waves are drawn in on the oscillator visualisers.
 * @type {String}
 */
var waveColor = "rgb(85, 255, 33)";

/**
 * Center x-coordinate for the browser window.
 * @type {number}
 */
var centreX;

/**
 * Center x-coordinate for the browser window.
 * @type {number}
 */
var centreY;

/**
 * Array containing every active oscillator.
 * @type {Object[]}
 */
var oscillators = [];

/**
 * Array containing every active instrument.
 * @type {Object[]}
 */
var instruments = [];

// TODO Add multiple canvases to allow for layered effects
/**
 * Reference to the HTML5 canvas used for the main synthesis.
 * @type {Object}
 */
var sCanvas = document.querySelector('#synth');

/**
 * Reference to the main synthesis canvas graphics context.
 * Used for drawing onto the canvas.
 * @type {Object} 
 */
var s = sCanvas.getContext('2d');


$(document).ready(function () {
    document.body.style.backgroundColor = bgColor;
    centreX = sCanvas.width  / 2;
    centreY = sCanvas.height / 2;

    Oscillator.addOscillator();
    Oscillator.addOscillator();
    Oscillator.addOscillator();

    Circle.addCircle("green circle", "rgb(125, 232, 79)");
    Circle.addCircle("purple circle", "rgb(193, 122, 240)");
    Circle.addCircle("orange circle", "rgb(245, 139, 73)");
    Circle.addCircle("blue circle", "rgb(107, 185, 237)");

    animate();
});
