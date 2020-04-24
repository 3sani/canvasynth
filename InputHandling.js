// Handles input from various buttons and sliders using jQuery.
 
// Collapse button for various modules
$('.collapseButton').click(function () {
    let moduleID = $(this).attr("module");
    switch (moduleID.charAt(0)) {
        case 'o':
            let attr = "[osc='" + moduleID.charAt(1) + "']";
            $('.visualiser' + attr + ', .oscillatorParameters' + attr).toggle();
            break;
        default:
            break;
    }
});

// Update oscillator frequency from slider.
$('.freq').on('input', function () {
    osc = oscillators[parseInt($(this).attr("osc"))];

    // The input is read on a curve to allow for finer control in small values
    osc.frequency = Math.round(Math.pow(1.006932, this.value)); 
    osc.updateOscillator();
});

// Update oscillator amplitude from slider.
$('.amplitude').on('input', function () {
    osc = oscillators[parseInt($(this).attr("osc"))];

    // The input is read on a curve to allow for finer control in values around 
    // 1 and then made symmetrical so the amplitude of 1 is at the middle of
    // the slider exactly
    osc.amplitude = 1 + (-0.000001 * this.value + 0.01) * this.value;
    osc.updateOscillator();
});

// Update oscillator x-offsset from slider.
$('.xoffset').on('input', function () {
    osc = oscillators[parseInt($(this).attr("osc"))];
    osc.xoffset = this.value / 1000;
    osc.updateOscillator();
});

// Update oscillator y-offsset from slider.
$('.yoffset').on('input', function () {
    osc = oscillators[parseInt($(this).attr("osc"))];
    osc.yoffset = this.value / 250;
    osc.updateOscillator();
});

// On doubleclick reset to default value
$('.oscillatorParameter').on('dblclick', function(){
    $(this).val($(this).attr("defaultValue"));
    $(this).trigger('input');
});

// Update oscillator wave type from dropdown
$('.waveMenu').change(function () {
    osc = oscillators[parseInt($(this).attr("osc"))];
    osc.type = parseInt(this.value);
    osc.updateOscillator();
});

// Instrument enabled / disabled dropdown.
$('.instrumentEnabled').on('input', function () {
    ins = instruments[parseInt($(this).attr("ins"))];
    ins.enabled = Boolean(this.value == 1);
});

// All the instrument dropdowns.
$('.oscillatorPicker').on('input', function () {
    ins = instruments[parseInt($(this).attr("ins"))];
    switch ($(this).attr('param')) {
        case "xPos":
            ins.xOsc = this.value;
            break;
    
        case "yPos":
            ins.yOsc = this.value;
            break;

        case "alpha":
            ins.alphaOsc = this.value;
            break;
    }
});

// Adds oscillator from add oscillator button.
$('#addOscillator').click(function () {
    Oscillator.addOscillator();
    if (oscillators.length >= maxOscillators) $(this).hide();
});

// Adds instrument from add instrument button.
$('#addOscillator').click(function () {
    Oscillator.addOscillator();
    if (oscillators.length >= maxOscillators) $(this).hide();
});
