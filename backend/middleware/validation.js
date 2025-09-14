const validate = {};

validate.name = (name) => {
    return name && name.length >= 20 && name.length <= 60;
};

validate.address = (address) => {
    return address && address.length <= 400;
};

validate.password = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(.{8,16})$/;
    return passwordRegex.test(password);
};

validate.email = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

module.exports = validate;