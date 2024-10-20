const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  name: {type: String, required: true},
  phoneNumber: {type: String},
  website: {type: String},
  openingHours: [String],
  photos: [String], // Store photo URLs
  reviews: [
    {
      authorName: String,
      rating: Number,
      text: String,
    },
  ],
  briefDescription: {type: String},
  geometry: {
    location: {
      lat: {type: Number, required: true}, // Latitude
      lng: {type: Number, required: true}, // Longitude
    },
    viewport: {
      northeast: {
        lat: {type: Number, required: true}, // Northeast Latitude
        lng: {type: Number, required: true}, // Northeast Longitude
      },
      southwest: {
        lat: {type: Number, required: true}, // Southwest Latitude
        lng: {type: Number, required: true}, // Southwest Longitude
      },
    },
  },
});

const itinerarySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  activities: [activitySchema], // List of activities for that date
});

const placeSchema = new mongoose.Schema({
  name: {type: String, required: true},
  phoneNumber: {type: String},
  website: {type: String},
  openingHours: [String],
  photos: [String], // You can store photo URLs here
  reviews: [
    {
      authorName: String,
      rating: Number,
      text: String,
    },
  ],
  types: [String],
  formatted_address: {
    type: String,
    required: true,
  },
  briefDescription: {type: String},
  geometry: {
    location: {
      lat: {type: Number, required: true}, // Latitude
      lng: {type: Number, required: true}, // Longitude
    },
    viewport: {
      northeast: {
        lat: {type: Number, required: true}, // Northeast Latitude
        lng: {type: Number, required: true}, // Northeast Longitude
      },
      southwest: {
        lat: {type: Number, required: true}, // Southwest Latitude
        lng: {type: Number, required: true}, // Southwest Longitude
      },
    },
  },
});

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true, // e.g., "Food", "Transport", "Accommodation", etc.
  },
  price: {
    type: Number,
    required: true, // The amount spent
  },
  splitBy: {
    type: String, // The person who paid for the expense
    required: true,
  },
  paidBy: {
    type: String, // The person who paid for the expense
    required: true,
  },
});

const tripSchema = new mongoose.Schema({
  tripName: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  startDay: {
    type: String,
    required: true,
  },
  endDay: {
    type: String,
    required: true,
  },
  background: {
    type: String,
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  travelers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  budget: {
    type: Number, // The total budget for the trip
  },
  expenses: [expenseSchema], // Array of expenses
  placesToVisit: [placeSchema],

  itinerary: [itinerarySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
