/**
 * http://www.efg2.com/Lab/ScienceAndEngineering/Spectra.htm
 * @param frequency
 */
function frequencyToRGB(frequency) {
    var r, g, b, gamma = 0.80, IntensityMax = 255, factor =1;

    switch (true) {
        case (380 <= frequency &&  frequency < 440):
            r = -(frequency - 440) / (440 - 380);
            g = 0.0;
            b = 1.0
            break;
        case (440 <= frequency &&  frequency < 490):
            r = 0.0
            g = (frequency - 440) / (490 - 440);
            b = 1.0
            break;
        case (490 <= frequency &&  frequency < 510):
            r = 0.0;
            g = 1.0;
            b = -(frequency - 510) / (510 - 490);
            break;
        case (510 <= frequency &&  frequency < 580):
            r = (frequency - 510) / (580 - 510);
            g = 1.0;
            b = 0.0
            break;
        case (580 <= frequency &&  frequency < 645):
            r = 1.0;
            g = -(frequency - 645) / (645 - 580);
            b = 0.0
            break;
        case (645 <= frequency &&  frequency <= 780):
            r = 1.0;
            g = 0.0;
            b = 0.0
            break;
        default:
            r = 0.0;
            g = 0.0;
            b = 0.0
            break;
    }
    switch (true) {
        case (380 <= frequency &&  frequency < 420):
            factor = 0.3 + 0.7*(frequency - 380) / (420 - 380);
            break;
        case (420 <= frequency &&  frequency < 700):
            factor = 1.0;
            break;
        case (700 <= frequency &&  frequency < 780):
            factor = 0.3 + 0.7*(780 - frequency) / (780 - 700);
            break;
        default:
            factor = 0.0;
            break;
    }
//
    r = adjust(r, factor, IntensityMax, gamma);
    g = adjust(g, factor, IntensityMax, gamma);
    b = adjust(b, factor, IntensityMax, gamma);

    return 'rgb('+r+','+g+','+b+')';
}

/**
 *
 * @param color
 * @param factor
 * @param IntensityMax
 * @param gamma
 * @return {Number}
 */
function adjust(color, factor, IntensityMax, gamma) {

    if (color > 0) {
        return Math.round(IntensityMax * Math.pow(color * factor, gamma))
    }
    return 0;
}

/**
 *
 * @param soundFrequency
 * @param min
 * @param max
 * @return {Number}
 */
function soundFrequencyToColorFrequency(soundFrequency, min, max) {
    min = min || 80;
    max = max || 800;
    var minPoint = {
        'x' : min,
        'y' : 780
    };
    var maxPoint = {
        'x' : max,
        'y' : 380
    };

    var a, b;

    a = -(minPoint.x * (1 - (maxPoint.y * minPoint.y))) / (minPoint.y - minPoint.x);
    b = maxPoint.y - (a / maxPoint.x);

    soundFrequency = Math.abs(soundFrequency);
    if (soundFrequency > 0) {
        return (a/soundFrequency) + b;
    }
    return 0;
}

function paintBackgroundFromFrequency(freq, min, max) {
    var colorFrequency = soundFrequencyToColorFrequency(freq, min, max);
    var rgb = frequencyToRGB(colorFrequency);
    $("#container").css('background-color',  ""+rgb+"");
}
