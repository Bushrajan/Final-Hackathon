import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import jwt from 'jsonwebtoken';

import User from './models/User.js';
import HijabStyle from './models/HijabStyle.js';
import Review from './models/review.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
console.log('📦 Connected to MongoDB');

const users = [
  {
    name: 'Ayesha Khan',
    email: 'ayesha@example.com',
    password: '123456',
    profileImage: 'https://i.ibb.co/avatar1.png',
  },
  {
    name: 'Zara Malik',
    email: 'zara@example.com',
    password: '123456',
    profileImage: 'https://i.ibb.co/avatar2.png',
  },
];

const styles = [
  {
    name: 'Elegant Wrap',
    description: 'Soft chiffon with layered folds.',
    image: 'https://i.ibb.co/elegant.jpg',
  },
  {
    name: 'Turban Twist',
    description: 'Bold and modern turban style.',
    image: 'https://i.ibb.co/turban.jpg',
  },
];

const reviews = [
  {
    rating: 5,
    text: 'Absolutely loved the Elegant Wrap!',
  },
  {
    rating: 4,
    text: 'Turban Twist is stylish and comfy.',
  },
];

const importData = async () => {
  try {
    await User.deleteMany();
    await HijabStyle.deleteMany();
    await Review.deleteMany();

    const insertedUsers = await User.insertMany(users);
    const insertedStyles = await HijabStyle.insertMany(styles);

    // Link reviews to users and styles
    const reviewDocs = [
      {
        ...reviews[0],
        user: insertedUsers[0]._id,
        hijabStyle: insertedStyles[0]._id,
      },
      {
        ...reviews[1],
        user: insertedUsers[1]._id,
        hijabStyle: insertedStyles[1]._id,
      },
    ];

    await Review.insertMany(reviewDocs);

    console.log('✅ Dummy data imported');

    // Show JWT tokens for testing
    insertedUsers.forEach(user => {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      console.log(`🔐 Token for ${user.email}: ${token}`);
    });

    process.exit();
  } catch (err) {
    console.error('❌ Import failed:', err.message);
    process.exit(1);
  }
};

// 🛡️ Confirm before deleting
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('⚠️ This will delete existing data. Continue? (y/n): ', async (answer) => {
  rl.close();
  if (answer.toLowerCase() === 'y') {
    await importData();
  } else {
    console.log('❌ Operation cancelled.');
    process.exit();
  }
});