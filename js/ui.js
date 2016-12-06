document.getElementById("count").addEventListener("blur", function () {
    var min_div = document.getElementById("min-group");
    var max_div = document.getElementById("max-group");
    var target_index = parseInt(this.value);
    if (target_index == max_div.childElementCount - 1) {
        return;
    }
    while (min_div.childElementCount > 1) {
        min_div.removeChild(min_div.lastChild);
        max_div.removeChild(max_div.lastChild);
    }
    if (target_index < 1 || target_index > 10) {
        target_index = 2;
        this.value = 2;
    }
    for (var i = 0; i < target_index; i++) {
        var min_val = document.createElement("div");
        min_val.className = "col-sm-1";
        min_val.innerHTML = '<input required type="text" class="form-control decimal-input" id="min-' + i + '" placeholder="Min ' + (i + 1) + '">'
        var max_val = document.createElement("div");
        max_val.className = "col-sm-1";
        max_val.innerHTML = '<input required type="text" class="form-control decimal-input" id="max-' + i + '" placeholder="Max ' + (i + 1) + '">'
        min_div.appendChild(min_val);
        max_div.appendChild(max_val);
    }
});

document.getElementById("add-criterion").addEventListener("click", function () {
    var criterion_div = document.getElementById("criterion-group");
    var index = criterion_div.childElementCount;
    if (index == 10) {
        return;
    }
    var criterionNode = document.createElement("div");
    criterionNode.className = "form-group";
    criterionNode.innerHTML =
        '<label class="control-label col-sm-1" for="criterion-' + index + '">&straightphi;-' + (index + 1) + ':</label>\
        <div class="col-sm-10">\
            <input required type="text" class="form-control" id="criterion-' + index + '" placeholder="x1^2+x2^2">\
        </div>';
    criterion_div.appendChild(criterionNode);
    var lambdaNode = document.createElement("div");
    lambdaNode.className = "col-sm-1";
    lambdaNode.innerHTML = '<input required type="number" min="1" max="9" class="form-control" id="lambda-' + index + '" placeholder="&lambda;-' + (index + 1) + '">'
    document.getElementById("lambda-group").appendChild(lambdaNode);
    document.getElementById("remove-criterion").removeAttribute("disabled");
    if (index == 9) {
        this.setAttribute("disabled","disabled");
    }
});
document.getElementById("remove-criterion").addEventListener("click", function () {
    if(this.disabled) {
        return;
    }
    var criterion_div = document.getElementById("criterion-group");
    var lambda_div = document.getElementById("lambda-group");
    if (criterion_div.childElementCount > 2) {
        criterion_div.removeChild(criterion_div.lastElementChild);
        lambda_div.removeChild(lambda_div.lastElementChild);
    }
    if (criterion_div.childElementCount == 2) {
        this.setAttribute("disabled","disabled");
    }
    if (criterion_div.childElementCount < 10) {
        document.getElementById("add-criterion").removeAttribute("disabled");
    }
});

jQuery('.decimal-input').keyup(function (e) {
    if(($(this).val().split(".")[0]).indexOf("00")>-1){
        $(this).val($(this).val().replace("00","0"));
    } else {
        $(this).val($(this).val().replace(/[^0-9\.]/g,''));
    }

    if($(this).val().split(".")[2] != null || ($(this).val().split(".")[2]).length ){
        $(this).val($(this).val().substring(0, $(this).val().lastIndexOf(".")));
    }
});

function validateCriterion(inputElement, index) {
    validateInputByRegex(inputElement,
        "Invalid criterion " + index + " format.",
        /^(-?\d+\*)?(([xX]\d+)|\d+)(\^\d+)?([+\-*/](-?\d+\*)?(([xX]\d+)|\d+)(\^\d+)?)*$/
    );
}

function validateInputByRegex(inputElement, errorMessage, regex) {
    if (regex.test(inputElement.value.trim()) || inputElement.value.trim() === "") {
        if (inputElement.value.trim() === "") {
            inputElement.style.removeProperty("background-color");
        } else {
            inputElement.style.backgroundColor = "#dff0d8";
        }
        if (document.getElementById(inputElement.id + "-error-div") != null) {
            removeErrorMessageDiv(inputElement.id + "-error-div");
        }
    } else {
        inputElement.style.backgroundColor = "#f2dede";
        if (document.getElementById(inputElement.id + "-error-div") == null) {
            addErrorMessageDiv(inputElement.id + "-error-div", errorMessage);
        }
    }
}

function validateInputByCondition(inputElement, errorMessage, conditionFunction) {
    if (conditionFunction() || inputElement.value.trim() === "") {
        if (inputElement.value.trim() === "") {
            inputElement.style.removeProperty("background-color");
        } else {
            inputElement.style.backgroundColor = "#dff0d8";
        }
        if (document.getElementById(inputElement.id + "-error-div") != null) {
            removeErrorMessageDiv(inputElement.id + "-error-div");
        }
    } else {
        inputElement.style.backgroundColor = "#f2dede";
        if (document.getElementById(inputElement.id + "-error-div") == null) {
            addErrorMessageDiv(inputElement.id + "-error-div", errorMessage);
        }
    }
}

function addErrorMessageDiv(id, message) {
    var node = document.createElement("div");
    node.id = id;
    node.className = "alert alert-danger";
    node.innerHTML = "<strong>Error!</strong> " + message;
    document.getElementById("error-div").appendChild(node);
}

function removeErrorMessageDiv(id) {
    var elem = document.getElementById(id);
    if (elem != null) {
        elem.remove();
    }
}

Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};

function hasUppercaseChar(str) {
    return str.toLowerCase() != str.value;
}

function hasLowercaseChar(str) {
    return str.toLowerCase() != str.value;
}

function hasNumber(str) {
    return /\d/.test(str);
}