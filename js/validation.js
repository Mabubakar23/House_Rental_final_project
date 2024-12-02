//validation.js
export function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll("input[required], textarea[required]");
    let isValid = true;

    inputs.forEach((input) => {
        if (!input.value.trim()) {
            input.classList.add("error");
            isValid = false;
        } else {
            input.classList.remove("error");
        }
    });

    return isValid;
}
