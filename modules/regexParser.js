// Insert explicit concatenation operator '.'
export function insertConcat(regex) {

    let result = "";

    for (let i = 0; i < regex.length; i++) {

        let current = regex[i];
        let next = regex[i + 1];

        result += current;

        if (!next) continue;

        if (
            (/[a-z]/.test(current) || current === ')' || current === '*') &&
            (/[a-z]/.test(next) || next === '(')
        ) {
            result += '.';
        }
    }

    return result;
}


// Convert regex to postfix using Shunting Yard
export function toPostfix(regex) {

    // First insert concatenation operators
    regex = insertConcat(regex);

    const precedence = {
        '*': 3,
        '.': 2,
        '|': 1
    };

    const stack = [];
    let output = "";

    for (let char of regex) {

        // If symbol (operand)
        if (/[a-z]/.test(char)) {
            output += char;
        }

        // Left parenthesis
        else if (char === '(') {
            stack.push(char);
        }

        // Right parenthesis
        else if (char === ')') {

            while (stack.length && stack[stack.length - 1] !== '(') {
                output += stack.pop();
            }

            stack.pop(); // remove '('
        }

        // Operator
        else {

            while (
                stack.length &&
                stack[stack.length - 1] !== '(' &&
                precedence[stack[stack.length - 1]] >= precedence[char]
            ) {
                output += stack.pop();
            }

            stack.push(char);
        }
    }

    // Pop remaining operators
    while (stack.length) {
        output += stack.pop();
    }

    return output;
}