import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
const url = `mongodb+srv://docsuser:docsuser123@cluster0.lb8gg2f.mongodb.net/fundraising?retryWrites=true&w=majority`
const connection = async(url)=>{
  try {
      await mongoose.connect(url);
      console.log("db connected");
  } catch (error) {
      console.log('Error while connecting with the database ', error);
  }
}
connection(url)

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  referralCode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const donationSchema = new mongoose.Schema({
  donorName: String,
  amount: Number,
  referralCode: String,
  createdAt: { type: Date, default: Date.now }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});
const User = mongoose.model('User', userSchema);
const Donation = mongoose.model('Donation', donationSchema);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'fundraising123', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = generateReferralCode();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      referralCode
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fundraising123'
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fundraising123'
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

app.post('/api/donations/create', async (req, res) => {
  try {
    const { donorName, amount, referralCode } = req.body;
    const donation = new Donation({
      donorName,
      amount,
      referralCode
    });

    await donation.save();
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating donation' });
  }
});
app.get('/api/donations/total', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const total = await Donation.aggregate([
      { $match: { referralCode: user.referralCode } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({ total: total.length > 0 ? total[0].total : 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching total donations' });
  }
});
app.get('/api/donations/transactions', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const transactions = await Donation.find({ referralCode: user.referralCode })
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});
app.get('/', (req, res) => {
  res.redirect('/login');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
