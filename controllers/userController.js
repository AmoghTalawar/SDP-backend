import asyncHandler from "express-async-handler";
import { generateToken } from "../utils/generateToken.js";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import {
  generateEmailVerificationToken,
  passwordResetVerificationToken,
} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import Affiliate from "../models/patientModel.js";

import { sendMail } from "../utils/sendEmail.js";
import { emailVerificationTemplate } from "../templates/welcomeTemplate.js";
import { subscribedUserTemplate } from "../templates/subscribedUserTemplate.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      code: 400,
      success: false,
      message: "Email and Password Both are Required",
    });
    throw new Error("Bad Request");
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      code: 404,
      success: false,
      message: "User Doesn't Exist!",
    });
  }

  if (
    user &&
    (await //user.matchPassword(password)
    user.password) == password
  ) {
    res.json({
      code: 200,
      message: "userloggedin succesfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
    // }
  } else {
    // if (user && !user.emailVerified) {
    //   res.status(403).json({
    //     code: 403,
    //     success: false,
    //     message: "Email is not verified",
    //   });
    // }
    res.status(401).json({
      code: 401,
      success: false,
      message: "Email and Password do not match",
    });
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, locationId } = req.body;
  console.log("Request Body : ", req.body);
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(422).json({
      code: 422,
      success: false,
      message: "User already exists",
    });
  }

  const obj = {
    name: name,
    email: email,
    password: password,
    locationId: locationId,
  };

  const user = await User.create(obj);

  if (user) {
    // const verificationToken = generateEmailVerificationToken(user._id);

    // const mailResponse = await sendMail(
    //   email,
    //   "Welcome to website",
    //   emailVerificationTemplate(verificationToken, name)
    // );

    return res.status(201).json({
      code: 201,
      message: "user created successfully",
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({
      code: 400,
      success: false,
      message: "Error registering user",
    });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (user.isAffiliate) {
      const affilate = await Affiliate.findOne({ user_id: user._id });

      if (affilate) {
        res.json({
          code: 200,
          success: true,
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSubscribed: user.isSubscribed,
          isAffiliate: user.isAffiliate,
          coupon: affilate.coupon,
          balance: affilate.balance,
        });
      } else {
        res.json({
          code: 401,
          message: "error getting affiliate",
          success: false,
        });
      }
    } else {
      res.json({
        code: 200,
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSubscribed: user.isSubscribed,
        package: user.package,
        isAffiliate: user.isAffiliate,
      });
    }
  } else {
    res.status(404).json({
      code: 404,
      success: false,
      message: "User Not Found",
    });
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const pageSize =
    Number(req?.query?.limit) <= 50 ? Number(req.query.limit) : 50;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await User.countDocuments({ ...keyword });
  const users = await User.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  for (var i of users) {
  }

  res.json({ users, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.status(200).json({
      code: 200,
      success: true,
      message: "User Removed",
    });
  } else {
    res.status(404).json({
      code: 404,
      success: false,
      message: "User Not Found",
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json({ user, success: true, code: 200 });
  } else {
    res.status(404).json({
      code: 404,
      success: false,
      message: "User Not Found",
    });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      code: 200,
      success: true,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404).json({
      code: 404,
      success: false,
      message: "User Not Found",
    });
  }
});

const sendResetPassword = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({
      success: false,
      message: "Bad Request",
    });
  }

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: "User Not Found",
      });
    }

    const verificationToken = passwordResetVerificationToken(user._id);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const url = `https://www.contentsyndy.com/reset/${verificationToken}`;
    var mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Reset Password",
      html: `Click <a href = '${url}'>here</a> to reset Password.`,
    };
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        return res.status(201).json({
          code: 201,
          message: "A error occur while sending reset link, please try again",
          success: false,
          emailSent: false,
        });
      } else {
        return res.status(200).json({
          code: 200,
          message: "Password Reset Link Sent",
          emailSent: true,
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      emailSent: false,
      code: 500,
      message: err,
    });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  // Check we have an id
  if (!token) {
    return res.status(422).send({
      message: "Missing Token",
    });
  }

  if (!req.body.password) {
    return res.status(422).send({
      message: "Missing password",
    });
  }

  let payload = null;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);

    console.log(payload.id);
  } catch (err) {
    return res.status(500).send(err);
  }
  try {
    const user = await User.findOne({ _id: payload.id });
    if (!user) {
      return res.status(404).send({
        message: "User does not  exists",
      });
    }
    // Step 3 - Update user verification status to true
    user.password = req.body.password;
    await user.save();

    return res.status(200).send({
      code: 200,
      message: "password reset successfully",
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

export {
  sendResetPassword,
  resetPassword,
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
