// Legacy error messages for backward compatibility
export const ErrorMessages = {
    PHONE_REQUIRED: "Phone number is required.",
    PHONE_INVALID: "Phone number must be a valid Lebanese number.",
    VERIFICATION_REQUIRED: "Verification code is required.",
    VERIFICATION_INCORRECT: "Incorrect verification code.",
    FIRSTNAME_REQUIRED: "First name can't be empty.",
    FIRSTNAME_INVALID: "First name should only contain letters.",
    LASTNAME_REQUIRED: "Last name can't be empty.",
    LASTNAME_INVALID: "Last name should only contain letters.",
    PASSWORD_REQUIRED: "Password is required.",
    PASSWORD_INCORRECT:"Password is incorrect.",
    PASSWORD_WEAK: "Password should be at least 6 characters and contain a number.",
    CONFIRM_PASSWORD_REQUIRED: "Please confirm your password.",
    PASSWORDS_NOT_MATCHING: "Passwords do not match.",
};

// New translation-based error messages
export const getErrorMessages = (tErrors) => ({
    PHONE_REQUIRED: tErrors('phoneRequired'),
    PHONE_INVALID: tErrors('phoneInvalid'),
    VERIFICATION_REQUIRED: tErrors('verificationRequired'),
    VERIFICATION_INCORRECT: tErrors('verificationIncorrect'),
    FIRSTNAME_REQUIRED: tErrors('firstNameRequired'),
    FIRSTNAME_INVALID: tErrors('firstNameInvalid'),
    LASTNAME_REQUIRED: tErrors('lastNameRequired'),
    LASTNAME_INVALID: tErrors('lastNameInvalid'),
    PASSWORD_REQUIRED: tErrors('passwordRequired'),
    PASSWORD_INCORRECT: tErrors('passwordIncorrect'),
    PASSWORD_WEAK: tErrors('passwordWeak'),
    CONFIRM_PASSWORD_REQUIRED: tErrors('confirmPasswordRequired'),
    PASSWORDS_NOT_MATCHING: tErrors('passwordsNotMatching'),
});