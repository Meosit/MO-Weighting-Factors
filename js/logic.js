document.getElementById("input-form").addEventListener("submit", function (e) {
    initCalculation();
    publishProgress(1);
    var criterionStrings = collectCriterions();
    var functions = evalCriterionFunctions(criterionStrings);
    var lambdas = collectLambdas();
    var arguments = getArguments();
    publishProgress(5);
    var corteges = cartesianProduct(arguments);
    publishProgress(25);
    var criterionsValues = calculateCriterions(corteges, functions);
    publishProgress(40);
    var phis = calculateScalarCriterions(lambdas, criterionsValues);
    var minScalarCriterions = valueAndIndexesOfMin(phis);
    var result = {};
    result['phi'] = minScalarCriterions[0];
    result['corteges'] = [];
    for (var i = 1; i < minScalarCriterions.length; i++) {
        result['corteges'].push(corteges[minScalarCriterions[i]]);
    }
    result['lambdas'] = lambdas;

    printLambdas(lambdas);
    printPhi(minScalarCriterions[0]);
    printCriterionHead(criterionStrings);
    printCortegesAndCriterions(corteges, criterionsValues, minScalarCriterions);
    switchState(false);
    e.preventDefault();
    return false;
});

document.getElementById("back-button").addEventListener("click", function (e) {
    switchState(true);
    e.preventDefault();
    return false;
});

function printLambdas(lambdas) {
    var outputString = '';
    for (var i = 0; i < lambdas.length; i++) {
        outputString += '&lambda;<sub>' + (i + 1) + '</sub> = ' + lambdas[i].toFixed(3) + '; ';
    }
    outputString = outputString.substring(0, outputString.length - 2);
    $('#lambdas-output').html(outputString);
}

function printPhi(phi) {
    $('#phi-output').text(phi.toFixed(3));
}

function printCriterionHead(criterions) {
    $('#table-head').html('<th>X</th>');
    for (var i = 0; i < criterions.length; i++) {
        var criterion = '&Phi;<sub>' + (i + 1) + '</sub>(X) = ' + criterions[i];
        $('#table-head').append('<th>' + criterion + '</th>');
    }
}

function printCortegesAndCriterions(corteges, criterionValues, indexes) {
    $('#table-body').html('');
    for (var i = 1; i < indexes.length; i++) {
        var outputRow = '<tr>' + '<th>' + toFixedStringArray(corteges[indexes[i]]) + '</th>';
        for (var j = 0; j < criterionValues.length; j++) {
            outputRow += '<th>' + criterionValues[j][indexes[i]].toFixed(3) + '</th>';
        }
        outputRow += '</tr>';
        $('#table-body').append(outputRow);
    }
}

function toFixedStringArray(arr) {
    var x = 0;
    var len = arr.length;
    while (x < len) {
        arr[x] = arr[x].toFixed(3);
        x++
    }
    return '(' + arr.toString().replace(/,/g, ', ') + ')';
}

function assocArrayToString(arr) {
    var s = "{";
    for (var key in arr) {
        if (arr.hasOwnProperty(key)) {
            s += key + ' : [' + arr[key] + "], ";
        }
    }
    s = s.substring(0, s.length - 2);
    s += "}";
    return s;
}

function calculateScalarCriterions(lambdas, criterionsValues) {
    var phis = [];
    for (var i = 0; i < criterionsValues[0].length; i++) {
        var phi = 0;
        for (var j = 0; j < lambdas.length; j++) {
            phi += lambdas[j] * criterionsValues[j][i];
        }
        phis.push(phi);
    }
    return phis;
}


function calculateCriterions(corteges, functions) {
    var results = [];
    for (var i = 0; i < functions.length; i++) {
        results[i] = [];
        for (var j = 0; j < corteges.length; j++) {
            results[i].push(functions[i](corteges[j]));
        }
    }
    return results;
}

function valueAndIndexesOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }

    if (arr.length === 1) {
        return [arr[0], 0];
    }

    const PRECISION = 0.00001;
    var result = [arr[0], 0];
    for (var i = 1; i < arr.length; i++) {
        if (Math.abs(arr[i] - result[0]) < PRECISION) {
            result.push(i);
        } else {
            if (arr[i] < result[0]) {
                result = [];
                result[0] = arr[i];
                result[1] = i;
            }
        }
    }

    return result;
}

function cartesianProduct(matrix) {
    var count = Math.pow(matrix[0].length, matrix.length);
    var result = [];
    var updateValue = Math.floor(count / 20);
    var currPercent = 5;
    for (var j = 0; j < count; j++) {
        var cr = [];
        var nc = 1;
        for (var i = 0; i < matrix.length; i++) {
            cr.push(matrix[i][Math.floor(j / nc) % matrix[i].length]);
            nc *= matrix[i].length;
        }
        result.push(cr.reverse());
        if (j % updateValue == 0) {
            publishProgress(++currPercent);
        }
    }
    return result;
}

function collectCriterions() {
    var count = document.getElementById('criterion-group').childElementCount;
    var criterions = [];
    for (var i = 0; i < count; i++) {
        criterions[i] = (document.getElementById('criterion-' + i).value);
    }
    return criterions;
}

function collectLambdas() {
    var count = document.getElementById('lambda-group').childElementCount;
    var lambdas = [];
    for (var i = 0; i < count; i++) {
        lambdas[i] = (document.getElementById('lambda-' + i).value);
    }
    var sum = lambdas.reduce((a, b) => parseInt(a) + parseInt(b), 0);
    for (i = 0; i < lambdas.length; i++) {
        lambdas[i] = parseInt(lambdas[i]) / sum;
    }
    return lambdas;
}

function getArguments() {
    var arguments = [];
    var delta = collectDelta();
    var mins = collectMins();
    var maxs = collectMaxs();
    for (var i = 0; i < mins.length; i++) {
        arguments[i] = [];
        while (mins[i] <= maxs[i]) {
            arguments[i].push(mins[i]);
            mins[i] = mins[i] + delta;
        }
    }
    return arguments;
}

function collectMins() {
    var count = collectArgumentCount();
    var mins = [];
    for (var i = 0; i < count; i++) {
        mins[i] = (parseFloat(document.getElementById('min-' + i).value));
    }
    return mins;
}

function collectMaxs() {
    var count = collectArgumentCount();
    var maxs = [];
    for (var i = 0; i < count; i++) {
        maxs[i] = (parseFloat(document.getElementById('max-' + i).value));
    }
    return maxs;
}

function collectDelta() {
    return parseFloat($('#delta').val());
}

function collectArgumentCount() {
    return parseInt($('#count').val());
}

function evalCriterionFunctions(criterionStrings) {
    var criterionFunctions = [];
    for (var i = 0; i < criterionStrings.length; i++) {
        criterionFunctions[i] = getCriterionFunction(criterionStrings[i]);
    }
    return criterionFunctions;
}

function getCriterionFunction(criterionString) {
    criterionString = criterionString.replace(/([xX]\d+|\(.*?\))\^(\d+)/g, 'Math.pow($1, $2)');
    criterionString = criterionString.replace(/[xX](\d+)/g, (full, n) => 'x[' + (Number(n) - 1) + ']');
    return eval('(function (x) { return ' + criterionString + ';})');
}

function publishProgress(progress) {
    window.setTimeout(function () {
        $('#progressbar').attr('aria-valuenow', progress).css('width', progress + '%').text(progress + '%');
    }, 50);
}

function initCalculation() {
    $("#input-form").find(":input").prop('readonly', true);
    $('#calculate-button').prop('disabled', true);
    $('#progress-group').css('display', 'block');
    $('#progressbar').css('width', '0%');
    publishProgress(0);
}

function switchState(isInput) {
    if (isInput) {
        $('#progress-group').css('display', 'none');
        $('#input-form').css('display', 'block').find(":input").prop('readonly', false);
        $('#calculate-button').prop('disabled', false);
        $('#back-button').css('display', 'none');
        $('#result-form').css('display', 'none');
    } else {
        $('#progress-group').css('display', 'none');
        $('#back-button').css('display', 'block');
        $('#result-form').css('display', 'block');
    }
}