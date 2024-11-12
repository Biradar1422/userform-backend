// const User = require("../models/User");
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config();

// //user register

// exports.register = async (req, res) => {
//     try{
//         const {username, email, password} = req.body;
//         const newUser = new User({username, email, password});
//         await newUser.save();
//         res.status(201).json({message : "User Registered successfully"})

//     }catch(error){
//         res.status(400).json({error: error.massage})
//     }
// }

// //user login

// exports.login = async (req, res) =>{
//     try{
//         const {email, password} = req.body;
//         const user = await User.findOne({email})

//         if(!user){
//             return res.status(404).json({error : "User not found"})
//         }
        
//         const isMatch = await user.comparedPassword(password);
//         if(!isMatch){
//             return res.status(400).json({error : "Invalid Credentials"})
//         }

//         const token = jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn : '1h'})
//         res.json({token});
//     }catch(error){
//         res.status(400).json({error: error.message})
//     }
// }

const User = require("../models/User");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); // Import bcrypt

dotenv.config();

// User register
// exports.register = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         const newUser = new User({ username, email, password });
//         await newUser.save();
//         res.status(201).json({ message: "User Registered successfully" });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }
exports.register = async (req, res) => {
  const { name, dateOfBirth, email, password } = req.body;

  try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
      }

      // Hash the password before saving the user
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user with hashed password
      const newUser = new User({ name, dateOfBirth, email, password: hashedPassword });
      await newUser.save();

      // Generate JWT token
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Respond with success message and token
      res.status(201).json({
          message: 'User registered successfully',
          token,
      });
  } catch (error) {
      console.error(error); // Log error for better debugging
      res.status(500).json({ error: 'Server error' });
  }
};


exports.editUser = async (req, res) => {
  const { name, dateOfBirth, email, password } = req.body;
  try {
      const user = await User.findById(req.params.id); // Find user by ID

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Update user details
      user.name = name || user.name;
      user.dateOfBirth = dateOfBirth || user.dateOfBirth;
      user.email = email || user.email;

      // Optionally update password
      if (password) {
          user.password = password;
      }

      await user.save(); // Save updated user

      res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
      res.status(500).json({ error: 'Server error' });
  }
};


exports.getUsers = async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  // Delete a user
  exports.deleteUser = async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  

// User login
// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         const isMatch = await user.comparePassword(password);
//         if (!isMatch) {
//             return res.status(400).json({ error: "Invalid Credentials" });
//         }

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Use the comparePassword method from the User model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

