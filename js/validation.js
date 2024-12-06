/**
 * Validate a form by checking required fields.
 * Highlights invalid fields and provides user feedback.
 * 
 * @param {string} formId - The ID of the form to validate.
 * @returns {boolean} - Returns true if the form is valid, otherwise false.
 */
export function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID '${formId}' not found.`);
        return false;
    }

    const inputs = form.querySelectorAll("input[required], textarea[required], select[required]");
    let isValid = true;

    inputs.forEach((input) => {
        if (!input.value.trim()) {
            input.classList.add("error");
            displayErrorMessage(input, "This field is required.");
            isValid = false;
        } else {
            input.classList.remove("error");
            removeErrorMessage(input);
        }
    });

    return isValid;
}

/**
 * Display an error message for an invalid input field.
 * 
 * @param {HTMLElement} input - The input element to display the error for.
 * @param {string} message - The error message to display.
 */
function displayErrorMessage(input, message) {
    let errorMessage = input.parentElement.querySelector(".error-message");
    if (!errorMessage) {
        errorMessage = document.createElement("span");
        errorMessage.classList.add("error-message");
        input.parentElement.appendChild(errorMessage);
    }
    errorMessage.textContent = message;
}

/**
 * Remove the error message from an input field.
 * 
 * @param {HTMLElement} input - The input element to remove the error message for.
 */
function removeErrorMessage(input) {
    const errorMessage = input.parentElement.querySelector(".error-message");
    if (errorMessage) {
        errorMessage.remove();
    }
}

/**
 * Attach validation on input blur to provide immediate feedback.
 * 
 * @param {string} formId - The ID of the form to attach validation to.
 */
export function attachValidationListeners(formId) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID '${formId}' not found.`);
        return;
    }

    const inputs = form.querySelectorAll("input[required], textarea[required], select[required]");
    inputs.forEach((input) => {
        input.addEventListener("blur", () => {
            if (!input.value.trim()) {
                input.classList.add("error");
                displayErrorMessage(input, "This field is required.");
            } else {
                input.classList.remove("error");
                removeErrorMessage(input);
            }
        });
    });
}

/**
 * Clear validation messages from a form.
 * 
 * @param {string} formId - The ID of the form to clear validation messages from.
 */
export function clearValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID '${formId}' not found.`);
        return;
    }

    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
        input.classList.remove("error");
        removeErrorMessage(input);
    });
}