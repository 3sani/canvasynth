const assert = require('chai').assert;
var Oscillator = require('../Oscillators');

// Rounds to 8 decimal places to ignore floating point rounding errors
// in trig function calculations.
round = function(x){
    return Math.round(x * 100000000) / 100000000;
};

tau = Math.PI * 2;
synthesisPeriod = 360;

// Handy function for creating quick test oscillators
function createOsc(type, frequency, xoffset, yoffset, amplitude) {
    let oscillator = new Oscillator(
        visual=false,
        type,
        frequency,
        xoffset,
        yoffset,
        amplitude
    );
    oscillator.updateOscillator();
    o.push(oscillator);
}

describe('Oscillator', function () {
    beforeEach(function () {
        // Create oscillators array expected in app & empty it between tests.
        o = [];
    });

    it('Values stay within (-1, 1)', function () {
        // Create a few different test oscillators;
        createOsc(0, 1, 0, 0, 1);
        createOsc(0, 10, 0, 0.5, 10);
        createOsc(1, -10, 0, -0.0, -50);
        createOsc(2, 100, 0, 5, -500);
        createOsc(3, -100, 0, -5, 50);

        o.forEach(oscillator => {
            oscillator.val.forEach(value => {
                assert.isTrue(-1 <= value && value <= 1);
            })
        });
    });

    it('Common sine values correct', function () {
        createOsc(0, 1, 0, 0, 1);
        assert.equal(round(o[0].val[0]), 0);
        assert.equal(round(o[0].val[synthesisPeriod/4]), 1);
        assert.equal(round(o[0].val[synthesisPeriod/2]), 0);
        assert.equal(round(o[0].val[3*synthesisPeriod/4]), -1);
    });

    it('Square wave always -1 or 1', function() {
        createOsc(1, 1, 0, 0, 1);
        createOsc(1, 100, 0, 0, 1);
        createOsc(1, 1, 1, 0, 1);
        createOsc(1, 1, 0, 0, 10);

        o.forEach(oscillator => {
            oscillator.val.forEach(value => {
                assert.isTrue(round(value) == -1 || round(value) == 1);
            })
        });
    })

    it('Negative amplitude inverts output', function(){
        // Create a few different test oscillators;
        createOsc(0, 1, 0, 0, 1);
        createOsc(0, 1, 0, 0, -1);

        createOsc(0, 1, 0, 0, 10);
        createOsc(0, 1, 0, 0, -10);

        createOsc(0, 1, 0, 0, 0.1);
        createOsc(0, 1, 0, 0, -0.1);

        for(let i = 0; i < o.length; i+=2){
            for(let j = 0; j < synthesisPeriod; j++){
                assert.equal(o[i].val[j] * -1, o[i+1].val[j]);
            }
        }
    })
});