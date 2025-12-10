import express from 'express';
import Hotel from '../models/Hotel.js';

const router = express.Router();

// Get all hotels with search and filters
router.get('/', async (req, res) => {
  try {
    const { region, minPrice, maxPrice, rating, search } = req.query;

    let query = {};

    if (region) {
      query.region = region;
    }

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    query.availability = true;

    const hotels = await Hotel.find(query).sort({ rating: -1 });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get hotels by location (nearby)
router.get('/nearby', async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 50000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    const hotels = await Hotel.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)]
          },
          $maxDistance: Number(maxDistance)
        }
      },
      availability: true
    });

    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single hotel
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all regions
router.get('/regions/list', async (req, res) => {
  try {
    const regions = await Hotel.distinct('region');
    res.json(regions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create hotel (admin)
router.post('/', async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    const newHotel = await hotel.save();
    res.status(201).json(newHotel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
