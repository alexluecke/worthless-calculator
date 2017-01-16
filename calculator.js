const d = ',';

const operators = {
    '+': { name: 'plus',  f: (a, b) => a + b },
    '-': { name: 'minus', f: (a, b) => a - b },
    '*': { name: 'times', f: (a, b) => a * b },
    '/': { name: 'dividedBy', f: (a, b) => a / b | 0 } // integer division
};

function hasOp(arg) {
    return arg && isNaN(parseInt(arg)) && Object.keys(operators).some(op => arg.indexOf(op) !== -1);
}

// Example operator definition:
// function plus(arg) {
//    return d + [(typeof arg === 'function') ? arg() : arg, '+'].join(d);
// }

// Generate all operator definitions:
Object.keys(operators).forEach(op => {
    window[operators[op].name] = arg => d + [(typeof arg === 'function') ? arg() : arg, op].join(d);
});

// Example number definition:
// function one(arg) {
//    return (typeof arg === 'string') ? calculate(1 + arg) : 1;
// }

// Generate all number definitions:
['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'].forEach(
    (name, value) => {
        window[name] = (arg) => hasOp(arg) ? rpnCalculator(value + arg /* order matters! */) : value;
    }
);

// Reverse polish notation calculator since we defined our string representation in RPN
function rpnCalculator(str) {
    let stack = [];
    let acc = 0;
    str.replace(/\s/g, '')
        .split(d) // numbers and operators are delimited to allow any number (like 11) instead of 0-9
        .forEach(x => {
            let v = parseInt(x);
            if (isNaN(v)) {
                // all operators take 2 operands, if one is not defined the equation is malformed
                const b = stack.pop(), a = stack.pop();
                // order of arguments must match the verbage one(dividedBy(two)) = '12/',
                // but 1 will not be at the top of the stack
                acc = operators[x].f(a, b);
                stack.push(acc);
            } else {
                stack.push(v);
            }
        });
    return acc;
}

function run(inputId, outputId) {
    const input = document.querySelector(inputId);
    const output = document.querySelector(outputId);
    try {
        output.innerHTML=eval(input.value);
    } catch(e) {
        output.innerHTML='Input failed';
    }
    input.focus();
}

function runKey(inputId, outputId, event) {
    if (event.key === 'Enter') {
        run(inputId, outputId);
    }
}
