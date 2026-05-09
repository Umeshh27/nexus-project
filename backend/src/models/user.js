import mongoose from "mongoose";
import validator from "validator";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        maxLength: 50
    },
    role: {
        type: String,
        enum: ["admin", "member", "guest"],
        default: "member"
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: "Not a valid mail"
        }
    },
    password: {
        type: String,
        required: true,
    },


},
    { timestamps: true });

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jsonwebtoken.sign({ Userid: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
}

userSchema.methods.getRefreshToken = async function () {
    const user = this;
    const token = await jsonwebtoken.sign({ Userid: user._id }, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

userSchema.methods.validatePassword = async function (passwordByUser) {
    const user = this;
    const passwordHash = user.password;
    const isValid = await bcrypt.compare(passwordByUser, passwordHash);
    return isValid;
}

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});


const User = mongoose.model("Users", userSchema);

export default User;