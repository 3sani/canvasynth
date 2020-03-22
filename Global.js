const tau = 2 * Math.PI;

/** @type {number} Number of HTML5 canvas frames are drawn before the synthesisation loops */
var synthesisPeriod = 360;

/** @type {number} Counter for HTML5 canvas frames  */
var p = 0;

// TODO add all of these as parameters into the app
var fadeColor = "rgb(0,0,0)";
var fadeOpacity = 0.5;
var bgColor = "black";

var waveColor = "rgb(85, 255, 33)";

/** @type {number} Center x-coordinate for the browser window */
var centreX;

/** @type {number} Center x-coordinate for the browser window */
var centreY;

/** @type {Object[]} Array containing every active oscillator */
var oscillators = [];

// TODO Add multiple canvases to allow for layered effects
/** @type {Object} Reference to the HTML5 canvas used for the main synthesis */
var sCanvas = document.querySelector('#synth');

/** @type {Object} Reference to the main synthesis canvas graphics context. Used for drawing onto the canvas.*/
<<<<<<< HEAD
var s = sCanvas.getContext('2d');
=======
var s = sCanvas.getContext('2d');
>>>>>>> 2ea4ff268930afd679ad4a5d294f55127a11e89f
