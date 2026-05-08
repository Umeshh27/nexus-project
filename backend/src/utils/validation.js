import validator from "validator";

const isValid = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new Error("Enter required fields!!");
    }
    if (!validator.isEmail(email)) {
        throw new Error("Enter a valid Email!!");
    }
    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
    }
}

const validateEditProfileData = (req) => {
    const allowedUpdates = [
        "name",
        "email",
        "photoURL",
        "bio",
        "age",
        "gender",
        "skills",
    ];

    const isValid = Object.keys(req.body).every((key) =>
        allowedUpdates.includes(key)
    );
    return isValid;

}

export { isValid, validateEditProfileData };