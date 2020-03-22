// Collapse an oscillator to just the top bar.
$('.collapseButton').click(function () {
    let moduleID = $(this).attr("module");
    switch (moduleID.charAt(0)) {
        case 'o':
            oscAttribute = "[osc='" + moduleID.charAt(1) + "']";
            $('.visualiser' + oscAttribute + ', .oscillatorParameters' + oscAttribute).toggle();
            break;
        default:
            break;
    }
});

// Update oscillator frequency from slider.
$('.freq').on('input', function () {
    osc = oscillators[parseInt($(this).attr("osc"))];
    osc.frequency = Math.round(Math.pow(1.006932, this.value)); // Just a nice curve, allows for more contol with small values
    osc.updateOscillator();
});

// Update oscillator amplitude from slider.
$('.amplitude').on('input', function () {
    osc = oscillators[parseInt($(this).attr("osc"))];
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

// Adds oscillator from add oscillator button.
$('#addOscillator').click(function () {
    Oscillator.addOscillator();
    if (oscillators.length >= 10) $(this).hide();
});
//#endregion
