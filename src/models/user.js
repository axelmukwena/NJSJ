const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: [true, "The first name is required!"],
      trim: true,
    },
    surname: {
      type: String,
      require: [true, "The surname is required!"],
      trim: true,
    },
    email: {
      type: String,
      unique: [true, "This email is already used by another user!"],
      required: [true, "Email address is required!"],
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("That is not a valid email address");
      },
    },
    password: {
      type: String,
      required: [true, "The password is required"],
      minlength: [6, "The minimun length for a password is 6 characters"],
      trim: true,
      validate(value) {
        if (value.toLowerCase() === "password")
          throw new Error("Password cannot be used as a password");
      },
    },
    role: {
      type: String,
      required: [true, "Role is required!"],
      trim: true,
      validate(value) {
        const roles = ["publisher", "user"];
        const roleSearch = roles.find((role) => role === value.toLowerCase());
        if (!roleSearch) throw new Error("Invalid role!");
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await users.findOne({ email });
  // console.log("user:", user);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return null;

  return user;
};

// Linking user to articles reference
userSchema.virtual("tasks", {
  ref: "articles",
  localField: "_id",
  foreignField: "owner",
});

//Generate authentication token for valid user
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { _id: this._id.toString() },
    "sahbakfheb382392nufjdknd3ud3dnjdd"
  );

  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

// Hide private user data
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.role;

  return userObject;
};

// Hash passowrd before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 8);
  next();
});

const users = mongoose.model("Users", userSchema);

module.exports = {
  users,
};
