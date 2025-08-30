const express = require('express');
const { Schema, model } = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const connectdb = require('./db');
connectdb();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


const users_details = new Schema({
  Name: { type: String, required: true },
  user_id: { type: Number, unique: true, required: true },
  emailid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  storage:{type:Number,required:true}
});



const User = model('user_details', users_details);



app.post('/register', async (req, res) => {
  try {
    const { name, emailid, password } = req.body;

    const existing = await User.findOne({ emailid });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const lastUser = await User.findOne().sort({ user_id: -1 });
    const newId = lastUser ? lastUser.user_id + 1 : 1;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      Name: name,
      user_id: newId,
      emailid,
      password: hashedPassword,
      storage:0
    });

    await newUser.save();

    res.json({ flag: true, user_id: newId });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { emailid, password } = req.body;

    const user = await User.findOne({ emailid });
    if (!user) return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

   
    return res.json({ success: true, user: { user_id: user.user_id, Name: user.Name, emailid: user.emailid } });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});


app.get('/profile', async (req, res) => {
  try {
    
    const user = await User.findOne().select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, id:user.user_id});
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
