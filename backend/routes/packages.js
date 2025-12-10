import express from 'express';
import Package from '../models/Package.js';

const router = express.Router();

// Get all packages with search and filters
router.get('/', async (req, res) => {
  try {
    const { region, minPrice, maxPrice, duration, difficulty, search } = req.query;

    let query = {};

    if (region) {
      query.region = region;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (duration) {
      query.duration = { $lte: Number(duration) };
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    query.availability = true;

    const packages = await Package.find(query).sort({ rating: -1 });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single package
router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all regions
router.get('/regions/list', async (req, res) => {
  try {
    const regions = await Package.distinct('region');
    res.json(regions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create package (admin)
router.post('/', async (req, res) => {
  try {
    const pkg = new Package(req.body);
    const newPackage = await pkg.save();
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
