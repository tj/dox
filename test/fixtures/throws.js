/**
 * Raise an exception for fun.
 *
 * @throws An error message.
 */
function crashMe() {
    throw "Bang!";
}

/**
 * Validate user input.
 *
 * @throws {TypeError} Invalid argument.
 */
function validateUserInput(input) {
    if (typeof input !== "string")) {
        throw new TypeError("Input is not a string");
    }
    return true;
}
