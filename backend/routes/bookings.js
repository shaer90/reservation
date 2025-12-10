import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';

const router = express.Router();

// Validation middleware
const bookingValidation = [
  body('type').isIn(['hotel', 'package']),
  body('guestInfo.firstName').notEmpty().trim(),
  body('guestInfo.lastName').notEmpty().trim(),
  body('guestInfo.email').isEmail().normalizeEmail(),
  body('guestInfo.phone').notEmpty().trim(),
  body('checkIn').isISO8601().toDate(),
  body('checkOut').isISO8601().toDate(),
  body('guests.adults').isInt({ min: 1 }),
  body('guests.children').optional().isInt({ min: 0 }),
  body('totalPrice').isFloat({ min: 0 })
];

// Create booking
router.post('/', bookingValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate dates
    const checkIn = new Date(req.body.checkIn);
    const checkOut = new Date(req.body.checkOut);

    if (checkOut <= checkIn) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    if (checkIn < new Date()) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past' });
    }

    const booking = new Booking(req.body);
    const newBooking = await booking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel')
      .populate('package');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings (admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('hotel')
      .populate('package')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
