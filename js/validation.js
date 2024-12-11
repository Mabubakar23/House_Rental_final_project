/**
 * Validates a form by checking required inputs and textareas.
 * @param {string} formId - The ID of the form to validate.
 * @returns {boolean} - Returns true if all required fields are valid, false otherwise.
 */
export function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID "${formId}" not found.`);
        return false;
    }

    const inputs = form.querySelectorAll("input[required], textarea[required]");
    let isValid = true;

    inputs.forEach((input) => {
        if (!input.value.trim()) {
            input.classList.add("error");
            showError(input, "This field is required.");
            isValid = false;
        } else {
            input.classList.remove("error");
            clearError(input);
        }
    });

    return isValid;
}

/**
 * Shows an error message for an invalid input field.
 * @param {HTMLElement} input - The input element to show an error for.
 * @param {string} message - The error message to display.
 */
function showError(input, message) {
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains("error-message")) {
        errorElement = document.createElement("div");
        errorElement.classList.add("error-message");
        input.insertAdjacentElement("afterend", errorElement);
    }
    errorElement.textContent = message;
}

/**
 * Clears the error message for a valid input field.
 * @param {HTMLElement} input - The input element to clear the error for.
 */
function clearError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) {
        errorElement.remove();
    }
}
