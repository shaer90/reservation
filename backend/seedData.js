import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hotel from './models/Hotel.js';
import Package from './models/Package.js';

dotenv.config();

const hotels = [
  {
    name: "Grand Plaza Hotel",
    description: "Luxury 5-star hotel in the heart of the city with panoramic views",
    region: "Downtown",
    address: "123 Main Street, City Center",
    location: {
      type: "Point",
      coordinates: [-73.935242, 40.730610] // NYC coordinates
    },
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945"],
    amenities: ["Free WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Room Service"],
    rating: 4.8,
    pricePerNight: 250,
    rooms: [
      { type: "Standard", capacity: 2, price: 250, available: 10 },
      { type: "Deluxe", capacity: 2, price: 350, available: 8 },
      { type: "Suite", capacity: 4, price: 500, available: 5 }
    ],
    availability: true
  },
  {
    name: "Beachside Resort",
    description: "Tropical paradise with direct beach access and water sports",
    region: "Coastal Area",
    address: "456 Ocean Drive, Beach District",
    location: {
      type: "Point",
      coordinates: [-80.128473, 25.790654] // Miami coordinates
    },
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"],
    amenities: ["Beach Access", "Water Sports", "Pool", "Restaurant", "Bar", "Spa"],
    rating: 4.6,
    pricePerNight: 300,
    rooms: [
      { type: "Ocean View", capacity: 2, price: 300, available: 15 },
      { type: "Beach Villa", capacity: 4, price: 600, available: 6 }
    ],
    availability: true
  },
  {
    name: "Mountain Lodge",
    description: "Cozy lodge with stunning mountain views and hiking trails",
    region: "Mountain Region",
    address: "789 Peak Road, Mountain Village",
    location: {
      type: "Point",
      coordinates: [-105.358887, 40.231937] // Colorado coordinates
    },
    images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"],
    amenities: ["Fireplace", "Hiking Trails", "Restaurant", "Free Parking", "WiFi"],
    rating: 4.5,
    pricePerNight: 180,
    rooms: [
      { type: "Standard Cabin", capacity: 2, price: 180, available: 12 },
      { type: "Family Cabin", capacity: 6, price: 350, available: 8 }
    ],
    availability: true
  }
];

const packages = [
  {
    name: "Tropical Island Getaway",
    description: "7-day paradise experience with island hopping and water activities",
    region: "Coastal Area",
    duration: 7,
    itinerary: [
      {
        day: 1,
        title: "Arrival and Beach Welcome",
        activities: ["Airport transfer", "Hotel check-in", "Welcome dinner"],
        meals: ["Dinner"]
      },
      {
        day: 2,
        title: "Island Exploration",
        activities: ["Snorkeling tour", "Beach activities", "Sunset cruise"],
        meals: ["Breakfast", "Lunch", "Dinner"]
      },
      {
        day: 3,
        title: "Water Sports Adventure",
        activities: ["Kayaking", "Paddleboarding", "Beach relaxation"],
        meals: ["Breakfast", "Lunch"]
      }
    ],
    inclusions: ["Accommodation", "Daily breakfast", "Airport transfers", "All activities", "Tour guide"],
    exclusions: ["International flights", "Travel insurance", "Personal expenses"],
    images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19"],
    price: 1500,
    maxGroupSize: 20,
    difficulty: "Easy",
    rating: 4.7,
    availability: true,
    destinations: [
      {
        name: "Paradise Beach",
        location: {
          type: "Point",
          coordinates: [-80.128473, 25.790654]
        }
      }
    ]
  },
  {
    name: "Mountain Adventure Trek",
    description: "5-day hiking expedition through scenic mountain trails",
    region: "Mountain Region",
    duration: 5,
    itinerary: [
      {
        day: 1,
        title: "Base Camp Setup",
        activities: ["Welcome briefing", "Equipment check", "Easy trail walk"],
        meals: ["Breakfast", "Lunch", "Dinner"]
      },
      {
        day: 2,
        title: "Summit Day 1",
        activities: ["Mountain hiking", "Photography session", "Camp under stars"],
        meals: ["Breakfast", "Lunch", "Dinner"]
      }
    ],
    inclusions: ["Accommodation", "All meals", "Equipment rental", "Professional guide", "Transportation"],
    exclusions: ["Personal gear", "Travel insurance", "Tips"],
    images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"],
    price: 800,
    maxGroupSize: 12,
    difficulty: "Challenging",
    rating: 4.9,
    availability: true,
    destinations: [
      {
        name: "Eagle Peak",
        location: {
          type: "Point",
          coordinates: [-105.358887, 40.231937]
        }
      }
    ]
  },
  {
    name: "City Culture Tour",
    description: "4-day cultural immersion with museums, cuisine, and local experiences",
    region: "Downtown",
    duration: 4,
    itinerary: [
      {
        day: 1,
        title: "City Highlights",
        activities: ["Walking tour", "Museum visits", "Local cuisine tasting"],
        meals: ["Breakfast", "Dinner"]
      },
      {
        day: 2,
        title: "Historical Journey",
        activities: ["Heritage sites", "Art galleries", "Evening show"],
        meals: ["Breakfast"]
      }
    ],
    inclusions: ["Hotel accommodation", "Breakfast daily", "All entrance fees", "Local guide", "City transport"],
    exclusions: ["Lunches and dinners", "Personal shopping", "Tips"],
    images: ["https://images.unsplash.com/photo-1477959858617-67f85cf4f1df"],
    price: 650,
    maxGroupSize: 25,
    difficulty: "Easy",
    rating: 4.4,
    availability: true,
    destinations: [
      {
        name: "Historic Downtown",
        location: {
          type: "Point",
          coordinates: [-73.935242, 40.730610]
        }
      }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Hotel.deleteMany({});
    await Package.deleteMany({});
    console.log('Cleared existing data');

    // Insert hotels
    await Hotel.insertMany(hotels);
    console.log('Hotels seeded successfully');

    // Insert packages
    await Package.insertMany(packages);
    console.log('Packages seeded successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
