import express from 'express';

const router = express.Router();

// Mock package data
const mockPackages = [
  {
    _id: '1',
    name: 'Paris Romance Package',
    description: 'Experience the city of love with this romantic 5-day package including luxury hotel, tours, and fine dining',
    destination: 'Paris, France',
    region: 'Europe',
    duration: 5,
    price: 2500,
    rating: 4.9,
    difficulty: 'Easy',
    includes: ['5-star Hotel', 'City Tours', 'Eiffel Tower Visit', 'Seine River Cruise', 'Fine Dining'],
    images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'],
    availability: true,
    maxGroupSize: 10
  },
  {
    _id: '2',
    name: 'Tokyo Adventure',
    description: 'Explore the vibrant culture of Tokyo with guided tours, traditional experiences, and modern attractions',
    destination: 'Tokyo, Japan',
    region: 'Asia',
    duration: 7,
    price: 3200,
    rating: 4.8,
    difficulty: 'Moderate',
    includes: ['Hotel Accommodation', 'City Tours', 'Temple Visits', 'Sushi Making Class', 'Mt. Fuji Day Trip'],
    images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'],
    availability: true,
    maxGroupSize: 12
  },
  {
    _id: '3',
    name: 'Bali Beach Escape',
    description: 'Relax on pristine beaches and discover Balinese culture in this tropical paradise',
    destination: 'Bali, Indonesia',
    region: 'Asia',
    duration: 6,
    price: 1800,
    rating: 4.7,
    difficulty: 'Easy',
    includes: ['Beachfront Resort', 'Island Tours', 'Snorkeling', 'Spa Treatment', 'Traditional Dance Show'],
    images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'],
    availability: true,
    maxGroupSize: 15
  },
  {
    _id: '4',
    name: 'Safari Adventure Kenya',
    description: 'Witness incredible wildlife in their natural habitat with expert guides',
    destination: 'Nairobi, Kenya',
    region: 'Africa',
    duration: 8,
    price: 4500,
    rating: 5.0,
    difficulty: 'Challenging',
    includes: ['Safari Lodge', 'Game Drives', 'Wildlife Photography', 'Maasai Village Visit', 'Hot Air Balloon'],
    images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800'],
    availability: true,
    maxGroupSize: 8
  },
  {
    _id: '5',
    name: 'New York City Explorer',
    description: 'Experience the Big Apple with Broadway shows, iconic landmarks, and culinary delights',
    destination: 'New York, USA',
    region: 'North America',
    duration: 4,
    price: 2100,
    rating: 4.6,
    difficulty: 'Easy',
    includes: ['Manhattan Hotel', 'Broadway Show', 'Statue of Liberty', 'Museum Passes', 'Food Tour'],
    images: ['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800'],
    availability: true,
    maxGroupSize: 20
  },
  {
    _id: '6',
    name: 'Greek Islands Cruise',
    description: 'Sail through the stunning Greek islands with stops at historical sites and beautiful beaches',
    destination: 'Greek Islands',
    region: 'Europe',
    duration: 10,
    price: 3800,
    rating: 4.9,
    difficulty: 'Moderate',
    includes: ['Cruise Ship Cabin', 'Island Hopping', 'Ancient Ruins Tours', 'Onboard Dining', 'Beach Activities'],
    images: ['https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800'],
    availability: true,
    maxGroupSize: 50
  }
];

// Get all packages with search and filters
router.get('/', async (req, res) => {
  try {
    const { region, minPrice, maxPrice, rating, search } = req.query;

    let filteredPackages = [...mockPackages];

    if (region) {
      filteredPackages = filteredPackages.filter(p => p.region === region);
    }

    if (minPrice) {
      filteredPackages = filteredPackages.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      filteredPackages = filteredPackages.filter(p => p.price <= Number(maxPrice));
    }

    if (rating) {
      filteredPackages = filteredPackages.filter(p => p.rating >= Number(rating));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPackages = filteredPackages.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.destination.toLowerCase().includes(searchLower)
      );
    }

    res.json(filteredPackages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all regions - MUST be before /:id route
router.get('/regions/list', async (req, res) => {
  try {
    const regions = [...new Set(mockPackages.map(p => p.region))];
    res.json(regions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single package
router.get('/:id', async (req, res) => {
  try {
    const packageItem = mockPackages.find(p => p._id === req.params.id);
    if (!packageItem) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(packageItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
