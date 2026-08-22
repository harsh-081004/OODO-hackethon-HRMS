const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const crypto = require('crypto');

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // Admin registration logic
  const dateOfJoining = new Date();
  const employeeId = await generateEmployeeId(userBody.name, userBody.companyName, dateOfJoining);

  const userToCreate = {
    ...userBody,
    employeeId,
    role: 'admin',
    profile: {
      ...userBody.profile,
      mobile: userBody.phone,
    }
  };

  return User.create(userToCreate);
};

const generateEmployeeId = async (name, companyName = 'Cash Point', dateOfJoining = new Date()) => {
  const parts = name.split(' ').filter(Boolean);
  const firstName = parts[0] || '';
  const lastName = parts.length > 1 ? parts[parts.length - 1] : '';

  const first2Name = firstName.substring(0, 2).toUpperCase().padEnd(2, 'X');
  const first2Last = lastName.substring(0, 2).toUpperCase().padEnd(2, 'X');

  const companyParts = companyName.split(' ').filter(Boolean);
  let companyPrefix = 'CP';
  if (companyParts.length >= 2) {
    companyPrefix = (companyParts[0][0] + companyParts[1][0]).toUpperCase();
  } else if (companyName.length >= 2) {
    companyPrefix = companyName.substring(0, 2).toUpperCase();
  }

  const year = dateOfJoining.getFullYear();

  // Find the last sequence for this year
  const prefix = `${companyPrefix}${first2Name}${first2Last}${year}`;
  const lastUser = await User.findOne({ employeeId: new RegExp(`^${companyPrefix}.*${year}\\d{4}$`) }).sort({ employeeId: -1 });

  let sequence = 1;
  if (lastUser && lastUser.employeeId) {
    const lastSequenceStr = lastUser.employeeId.slice(-4);
    const lastSequence = parseInt(lastSequenceStr, 10);
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  const sequenceStr = sequence.toString().padStart(4, '0');
  return `${prefix}${sequenceStr}`;
};

const createEmployee = async (employeeBody) => {
  if (await User.isEmailTaken(employeeBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const dateOfJoining = employeeBody.privateInfo?.dateOfJoining ? new Date(employeeBody.privateInfo.dateOfJoining) : new Date();

  // We need the admin's company name to generate the ID properly. Let's fetch the first admin's company name.
  // In a real multi-tenant app, this would be tied to the specific tenant.
  const admin = await User.findOne({ role: 'admin' });
  const companyName = admin ? admin.companyName : 'Default Company';

  const employeeId = await generateEmployeeId(employeeBody.name, companyName, dateOfJoining);
  const generatedPassword = crypto.randomBytes(8).toString('hex');

  const newEmployee = {
    ...employeeBody,
    employeeId,
    password: generatedPassword
  };

  const user = await User.create(newEmployee);
  // In a real app, send an email with the generated password here
  return { user, generatedPassword };
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const queryUsers = async (filter, options) => {
  return User.find(filter);
};

module.exports = {
  createUser,
  createEmployee,
  getUserById,
  getUserByEmail,
  updateUserById,
  queryUsers,
};
