const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Car = require('../models/car');

const router = express.Router();

// Middleware to authenticate user
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Car Upload Setup
const upload = multer({
  limits: { fileSize: 1000000 }, // Max 1MB file size
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
      return cb(new Error('Not an image'), false);
    }
    cb(null, true);
  },
}).array('images', 10);  // Allow up to 10 images

// Create Car
router.post('/cars', authMiddleware, (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ msg: err.message });

    const { title, description, tags } = req.body;
    const images = req.files.map(file => file.path);  // Store image paths

    const car = new Car({
      user: req.user,
      title,
      description,
      tags: tags.split(','),
      images,
    });

    await car.save();
    res.status(201).json(car);
  });
});

// Get List of Cars for the User
router.get('/cars', authMiddleware, async (req, res) => {
  const cars = await Car.find({ user: req.user });
  res.json(cars);
});

// Get Car Details
router.get('/cars/:id', authMiddleware, async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) return res.status(404).json({ msg: 'Car not found' });
  res.json(car);
});

// Update Car
router.put('/cars/:id', authMiddleware, async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) return res.status(404).json({ msg: 'Car not found' });

  // Update fields
  car.title = req.body.title || car.title;
  car.description = req.body.description || car.description;
  car.tags = req.body.tags || car.tags;
  car.images = req.body.images || car.images;

  await car.save();
  res.json(car);
});

// Delete Car
router.delete('/cars/:id', authMiddleware, async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) return res.status(404).json({ msg: 'Car not found' });

  await car.remove();
  res.json({ msg: 'Car removed' });
});

module.exports = router;
