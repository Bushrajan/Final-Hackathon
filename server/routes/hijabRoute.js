import express from 'express';
import { getAllHijabStyles } from './hijabGallController.js';
import HijabStyle from '../models/style.js';

const router = express.Router();

// 🔹 GET all hijab styles
router.get('/', getAllHijabStyles);

// 🔹 POST seed hijab styles (only if not already seeded)
router.post('/seed', async (req, res) => {
  try {
    // 🔒 Prevent duplicate seeding
    const count = await HijabStyle.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: 'Styles already seeded' });
    }

    // ✅ Proceed with seeding
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
      {
        name: 'Classic Draped',
        description: 'Traditional drape with timeless grace.',
        image: 'https://i.ibb.co/classic.jpg',
      },
      {
        name: 'Layered Luxe',
        description: 'Multi-layered look for volume and elegance.',
        image: 'https://i.ibb.co/layered.jpg',
      },
      {
        name: 'Casual Cotton',
        description: 'Breathable cotton for everyday wear.',
        image: 'https://i.ibb.co/cotton.jpg',
      },
      {
        name: 'Pinned Perfection',
        description: 'Securely pinned for active days.',
        image: 'https://i.ibb.co/pinned.jpg',
      },
      {
        name: 'Silk Serenity',
        description: 'Smooth silk for a luxurious feel.',
        image: 'https://i.ibb.co/silk.jpg',
      },
      {
        name: 'Boho Chic',
        description: 'Free-spirited style with earthy tones.',
        image: 'https://i.ibb.co/boho.jpg',
      },
      {
        name: 'Formal Flow',
        description: 'Perfect for events and formal occasions.',
        image: 'https://i.ibb.co/formal.jpg',
      },
      {
        name: 'Sporty Wrap',
        description: 'Lightweight and secure for workouts.',
        image: 'https://i.ibb.co/sporty.jpg',
      },
    ];

    await HijabStyle.insertMany(styles);
    res.status(201).json({ message: '10 hijab styles seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Seeding failed', error: error.message });
  }
});

export default router;