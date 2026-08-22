const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    companyLogo: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      private: true, // used by a custom plugin if we had one, but we'll strip manually
    },
    role: {
      type: String,
      enum: ['employee', 'admin', 'hr'],
      default: 'employee',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    profile: {
      mobile: { type: String, trim: true },
      department: { type: String, trim: true },
      address: { type: String },
      profilePicture: { type: String }, // URL to image
      documents: [{ name: String, url: String }],
    },
    privateInfo: {
      dateOfBirth: { type: Date },
      residingAddress: { type: String },
      nationality: { type: String },
      personalEmail: { type: String },
      gender: { type: String, enum: ['Male', 'Female', 'Other'] },
      maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
      dateOfJoining: { type: Date },
      bankDetails: {
        accountNumber: { type: String },
        bankName: { type: String },
        ifscCode: { type: String },
        panNo: { type: String },
        uanNo: { type: String },
      }
    },
    salaryStructure: {
      basic: { type: Number, default: 0 },
      allowances: { type: Number, default: 0 },
      deductions: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
