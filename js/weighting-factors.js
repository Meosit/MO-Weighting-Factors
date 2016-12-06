/*document.getElementById("username").addEventListener("blur", function () {
    validateInputByRegex(this,
        "Username must starts with upper-case letter, can consists only latin letters, digits and underscore, length 5-15 chars.",
        /^[A-Z][a-zA-Z_0-9]{4,14}$/
    );
});

document.getElementById("password").addEventListener("blur", function () {
    var elem = this;
    validateInputByCondition(this,
        "Password must contain at least one upper-case and lower-case letter, at least one digit, length 6-60 chars.",
        function () {
            return elem.value.length >= 6
                && elem.value.length <= 60
                && hasUppercaseChar(elem.value)
                && hasLowercaseChar(elem.value)
                && hasNumber(elem.value)
        })
});

document.getElementById("password-confirm").addEventListener("blur", function () {
    var elem = this;
    validateInputByCondition(this,
        "Passwords not match.",
        function () {
            return elem.value === document.getElementById("password").value
        })
});

document.getElementById("first-name").addEventListener("blur", function () {
    validateInputByRegex(this,
        "First name is one or more words started with capital letter",
        /^[A-Z][a-zA-Z]+(\s+?[A-Z][a-zA-Z]+)*?$/
    );
});

document.getElementById("last-name").addEventListener("blur", function () {
    validateInputByRegex(this,
        "Last name is one or more words started with capital letters and separates with dashes",
        /^[A-Z][a-zA-Z]+(-[A-Z][a-zA-Z]+)*?$/
    );
});

document.getElementById("age").addEventListener("blur", function () {
    var elem = this;
    validateInputByCondition(this,
        "Age must be in range 7-120",
        function () {
            return elem.value >= 7 && elem.value <= 120
        }
    );
});

// эта валидация понятное дело не очень идеальная,
// по хорошему надо каждый элемент адреса валидировать отдельно в разных полях
document.getElementById("shipment").addEventListener("blur", function () {
    validateInputByRegex(this,
        'Invalid shipment format. Correct is: "Address, City, State, PostalCode (like 220123), Country"',
        /^.*?,\s*?[A-Z]\w+\s*?,\s*?[A-Z]\w+\s*?,\s*?[0-9]{6}\s*?,\s*?[A-Z]\w+$/
    );
});

*/


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
    lambdaNode.innerHTML = '<input required type="text" class="form-control decimal-input" id="lambda-' + index + '" placeholder="&lambda;-' + (index + 1) + '">'
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

document.getElementById("input-form").addEventListener("submit", function (e) {
    this.style.display = 'none';
    document.getElementById("result-form").style.display = 'block';
    e.preventDefault();
    return false;
});

document.getElementById("back-button").addEventListener("click", function (e) {
    document.getElementById("result-form").style.display = 'none';
    document.getElementById("input-form").style.display = 'block';
    e.preventDefault();
    return false;
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