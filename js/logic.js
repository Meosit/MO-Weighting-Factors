document.getElementById("input-form").addEventListener("submit", function (e) {
    initCalculation();
    publishProgress(1, "Collecting data...");
    var functions = evalCriterionFunctions();
    var lambdas = collectLambdas();
    var arguments = getArguments();
    publishProgress(5, "Getting all possible argument corteges...");
    var corteges = cartesianProduct(arguments);
    publishProgress(25, "Calculating all criterions values...");
    var criterionsValues = calculateCriterions(corteges, functions);
    publishProgress(40, "Extracting Pareto points...");
    var paretoPoints = extractParetoPoints(criterionsValues);
    //switchScreen(false);
    e.preventDefault();
    return false;
});

document.getElementById("back-button").addEventListener("click", function (e) {
    switchScreen(true);
    e.preventDefault();
    return false;
});

function extractParetoPoints(criterionValues) {
    var mins = [];
    for (var i = 0; i < criterionValues.length; i++) {
        mins.push(getMinOfArray(criterionValues[i]));
    }

}

function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
    return Math.min().apply(null, numArray);
}

function calculateCriterions(corteges, functions) {
    var results = [];
    for (var i = 0; i < functions.length; i++) {
        results[i] = [];
        for (var j = 0; j < corteges.length; j++) {
            results[i].push(functions[i](corteges[j]));
        }
        publishProgress(35, "Criterion " + i + " has been calculated.");
    }
    return results;
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
            publishProgress(++currPercent, "Getting all possible argument corteges...");
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

function evalCriterionFunctions() {
    var criterionStrings = collectCriterions();
    var criterionFunctions = [];
    for (var i = 0; i < criterionStrings.length; i++) {
        criterionFunctions[i] = getCriterionFunction(criterionStrings[i]);
    }
    return criterionFunctions;
}

function getCriterionFunction(criterionString) {
    criterionString = criterionString.replace(/[xX](\d+)\^(\d+)/, 'Math.pow(x[$1], $2)');
    return eval('(function (x) { return ' + criterionString + ';})');
}

function publishProgress(progress, status) {
    window.setTimeout(function () {
        $('#progressbar').attr('aria-valuenow', progress).css('width', progress + '%').text(progress + '% ' + status);
    }, 50);
}

function initCalculation() {
    $("#input-form").find(":input").prop('readonly', true);
    $('#progress-group').css('display', 'block');
    $('#progressbar').css('width', '0%');
    publishProgress(0, "Let's start!");
}

function switchScreen(isInput) {
    if (isInput) {
        $('#progress-group').css('display', 'none');
        $('#input-form').css('display', 'block').find(":input").prop('readonly', false);
        $('#result-form').css('display', 'none');
    } else {
        $('#input-form').css('display', 'none');
        $('#result-form').css('display', 'block');
    }
}