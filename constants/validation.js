export const validateLebanesePhone = (phone) => {
    const lebanonRegex = /^(03|70|71|76|78|79|81|01|04|05|06|07|08|09)\d{6}$/;
    return lebanonRegex.test(phone);
};

export const validateName = (name) => {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(name);
};

export const validatePasswordStrength = (password) => {
    const passwordRegex = /^(?=.*[0-9]).{6,}$/;
    return passwordRegex.test(password);
};

