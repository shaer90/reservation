import express from 'express';

const router = express.Router();

// Mock hotel data
const mockHotels = [
  {
    _id: '1',
    name: 'Grand Plaza Hotel',
    description: 'Luxury hotel in the heart of the city with stunning views',
    address: '123 Main Street, Downtown',
    region: 'Downtown',
    pricePerNight: 150,
    rating: 4.5,
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    availability: true,
    location: {
      type: 'Point',
      coordinates: [-73.935242, 40.730610]
    },
    rooms: [
      { type: 'Standard Room', capacity: 2, price: 150, available: 5 },
      { type: 'Deluxe Suite', capacity: 4, price: 250, available: 3 },
      { type: 'Presidential Suite', capacity: 6, price: 500, available: 1 }
    ]
  },
  {
    _id: '2',
    name: 'Seaside Resort',
    description: 'Beautiful beachfront resort with ocean views',
    address: '456 Beach Road, Coastal Area',
    region: 'Coastal',
    pricePerNight: 200,
    rating: 4.8,
    amenities: ['WiFi', 'Beach Access', 'Pool', 'Restaurant', 'Bar'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    availability: true,
    location: {
      type: 'Point',
      coordinates: [-73.935242, 40.730610]
    },
    rooms: [
      { type: 'Ocean View Room', capacity: 2, price: 200, available: 8 },
      { type: 'Beach Villa', capacity: 4, price: 350, available: 4 },
      { type: 'Royal Beach Suite', capacity: 6, price: 600, available: 2 }
    ]
  },
  {
    _id: '3',
    name: 'Mountain View Lodge',
    description: 'Cozy lodge with breathtaking mountain scenery',
    address: '789 Mountain Pass, Highland',
    region: 'Mountain',
    pricePerNight: 120,
    rating: 4.3,
    amenities: ['WiFi', 'Fireplace', 'Hiking Trails', 'Restaurant'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
    availability: true,
    location: {
      type: 'Point',
      coordinates: [-73.935242, 40.730610]
    },
    rooms: [
      { type: 'Cozy Cabin', capacity: 2, price: 120, available: 6 },
      { type: 'Family Lodge', capacity: 4, price: 220, available: 4 }
    ]
  },
  {
    _id: '4',
    name: 'City Center Inn',
    description: 'Affordable and comfortable accommodation in prime location',
    address: '321 Central Ave, Midtown',
    region: 'Downtown',
    pricePerNight: 80,
    rating: 4.0,
    amenities: ['WiFi', 'Breakfast', 'Parking'],
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    availability: true,
    location: {
      type: 'Point',
      coordinates: [-73.935242, 40.730610]
    },
    rooms: [
      { type: 'Economy Room', capacity: 2, price: 80, available: 10 },
      { type: 'Business Suite', capacity: 3, price: 150, available: 5 }
    ]
  },
  {
    _id: '5',
    name: 'Luxury Palace Hotel',
    description: 'Five-star luxury experience with world-class amenities',
    address: '555 Luxury Lane, Uptown',
    region: 'Uptown',
    pricePerNight: 350,
    rating: 5.0,
    amenities: ['WiFi', 'Pool', 'Spa', 'Fine Dining', 'Concierge', 'Gym'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    availability: true,
    location: {
      type: 'Point',
      coordinates: [-73.935242, 40.730610]
    },
    rooms: [
      { type: 'Luxury Room', capacity: 2, price: 350, available: 6 },
      { type: 'Executive Suite', capacity: 4, price: 550, available: 4 },
      { type: 'Royal Penthouse', capacity: 8, price: 1200, available: 1 }
    ]
  },
  {
    _id: '6',
    name: 'Garden Boutique Hotel',
    description: 'Charming boutique hotel with beautiful gardens',
    address: '888 Garden Street, Suburban',
    region: 'Suburban',
    pricePerNight: 110,
    rating: 4.4,
    amenities: ['WiFi', 'Garden', 'Restaurant', 'Free Parking'],
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
    availability: true,
    location: {
      type: 'Point',
      coordinates: [-73.935242, 40.730610]
    },
    rooms: [
      { type: 'Garden Room', capacity: 2, price: 110, available: 7 },
      { type: 'Garden Suite', capacity: 4, price: 200, available: 3 }
    ]
  }
];

// Get all hotels with search and filters
router.get('/', async (req, res) => {
  try {
    const { region, minPrice, maxPrice, rating, search } = req.query;

    let filteredHotels = [...mockHotels];

    if (region) {
      filteredHotels = filteredHotels.filter(h => h.region === region);
    }

    if (minPrice) {
      filteredHotels = filteredHotels.filter(h => h.pricePerNight >= Number(minPrice));
    }

    if (maxPrice) {
      filteredHotels = filteredHotels.filter(h => h.pricePerNight <= Number(maxPrice));
    }

    if (rating) {
      filteredHotels = filteredHotels.filter(h => h.rating >= Number(rating));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredHotels = filteredHotels.filter(h =>
        h.name.toLowerCase().includes(searchLower) ||
        h.description.toLowerCase().includes(searchLower) ||
        h.address.toLowerCase().includes(searchLower)
      );
    }

    res.json(filteredHotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all regions - MUST be before /:id route
router.get('/regions/list', async (req, res) => {
  try {
    const regions = [...new Set(mockHotels.map(h => h.region))];
    res.json(regions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single hotel
router.get('/:id', async (req, res) => {
  try {
    const hotel = mockHotels.find(h => h._id === req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
