const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = 8000;
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*", // Allow all origins temporarily for debugging
  })
);

const jwt = require("jsonwebtoken");

mongoose
  .connect(
    "mongodb+srv://kulveercoder:t7aBsXUiUe2IcodA@cluster0.yohcu.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB Database connected");
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const User = require("./models/user");
const Order = require("./models/order");
const { send } = require("process");

//function to send verification email to the user
const sendVerificationEmail = async (email, verificationToken) => {
  //create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    //configure the email service
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  //compose the email message
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Please verify your email address",
    text: `Please click on the link to verify your email address: http://localhost:8000/verify/${verificationToken}`,
  };
  //send the verification email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error while sending verification email", error);
  }
};

//endpoint to register a user
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    //generate and store verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    //create new user
    const newUser = new User({
      name,
      email,
      password,
      verificationToken,
      verified: false,
    });

    //save the new user to the database
    await newUser.save();

    //send verification email to the user
    await sendVerificationEmail(newUser.email, verificationToken);
    res
      .status(200)
      .json({ message: "Registration successful! Verify your email." });
  } catch (error) {
    console.log("Error while registering user", error);
    res.status(500).json("Registration failed");
  }
});

//endpoint to verify email
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    //find the user with the verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).send("Invalid verification token");
    }
    //update the user as verified
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).send("Email verified successfully");
  } catch (error) {
    console.log("Error while verifying email", error);
    res.status(500).send("Verification failed");
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};
const secretKey = generateSecretKey();

//endpoint to login a user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json("Invalid email or password");
    }
    //check if the password is correct or not
    if (user.password !== password) {
      return res.status(401).json("Invalid password");
    }

    //generate a JWT token
    const token = jwt.sign({ userId: user._id }, secretKey);
    // Send the token to the client
    return res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

//endpoint to store new address
app.post("/addresses", async (req, res) => {
  try {
    const { userId, address } = req.body;

    //find the user by userid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //add the new address to the user's address array
    user.addresses.push(address);
    await user.save();

    return res.status(200).json({ message: "New address added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding new address" });
  }
});

//endpoint to get all the addresses of a particular user
app.get("/addresses/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const addresses = user.addresses;
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: "Error getting addresses" });
  }
});

//endpoint to store all the orders
app.post("/orders", async (req, res) => {
  try {
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =
      req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //create an array of product objects from the cart items
    const products = cartItems.map((item) => ({
      name: item?.title,
      quantity: item.quantity,
      price: item.price,
      image: item?.image,
    }));

    //create a new order
    const order = new Order({
      user: userId,
      products: products,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
    });
    await order.save();
    res.status(200).json({ message: "Order created successfully" });
  } catch (error) {
    console.log("error creating orders", error);
    res.status(500).json({ message: "Error creating order" });
  }
});

//get the user profile
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    //find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the user profile" });
  }
});

//get the order
app.get("/order/:userId", async (req, res) => {
  try {
    const orderId = req.params.userId;
    //find the order by orderId
    const orders = await Order.findById({ user:userId }.populate("user"));
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Order not found for this user" });
    }
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});
