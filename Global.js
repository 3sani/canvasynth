/**
 * @type {Number}
 * Mathematical constant tau = 2 * pi.
 */
const tau = 2 * Math.PI;

/**
 * @type {number}
 * Number of HTML5 canvas frames before the synthesisation loops.
 */
var synthesisPeriod = 360;

/**
 * @type {number}
 * Framecounter for HTML5 canvas frames.
 */
var p = 0;

/**
 * @type {Number}
 * How much the previous frame is faded out on the synthesisation canvas.
 */
var fadeOpacity = 0.5;

/**
 * @type {String}
 * What colour previous frames on the synthesisation canvas are faded with.
 */
var fadeColor = "rgb(0,0,0)";

/**
 * @type {String}
 * The page background color.
 */
var bgColor = "black";

/**
 * @type {String}
 * The colour waves are drawn in on the oscillator visualisers.
 */
var waveColor = "rgb(85, 255, 33)";

/**
 * @type {number}
 * Center x-coordinate for the browser window.
 */
var centreX;

/**
 * @type {number}
 * Center x-coordinate for the browser window.
 */
var centreY;

/**
 * @type {Object[]}
 * Array containing every active oscillator.
 */
var oscillators = [];

// TODO Add multiple canvases to allow for layered effects
/**
 * @type {Object}
 * Reference to the HTML5 canvas used for the main synthesis.
 */
var sCanvas = document.querySelector('#synth');

/**
 * @type {Object} 
 * Reference to the main synthesis canvas graphics context.
 * Used for drawing onto the canvas.
 */
var s = sCanvas.getContext('2d');

/** 
 * @type {Number}
 * Number of oscillators before the "add oscillator" button gets hidden.
 */
var maxOscillators = 10;