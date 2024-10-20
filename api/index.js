const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment');
const nodemailer = require('nodemailer');

const axios = require('axios');

const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');

mongoose
  .connect('mongodb+srv://sujan:sujan@cluster0.n87php1.mongodb.net/')
  .then(() => {
    console.log('Connected to Mongo Db');
  })
  .catch(err => {
    console.log('Error connecting to MongoDb', err);
  });

app.listen(port, () => {
  console.log('Server running on port 8000');
});

const Trip = require('./models/trip');
const User = require('./models/user');

app.post('/trip', async (req, res) => {
  const {tripName, startDate, endDate, startDay, endDay, background, host} =
    req.body;

  try {
    const start = moment(startDate);
    const end = moment(endDate);

    const itinerary = [];

    let currentDate = start.clone();

    while (currentDate.isSameOrBefore(end)) {
      itinerary.push({
        date: currentDate.format('YYYY-MM-DD'),
        activities: [],
      });
      currentDate.add(1, 'days');
    }

    console.log(itinerary);

    const trip = new Trip({
      tripName,
      startDate: moment(startDate).format('DD MMMM YYYY'),
      endDate: moment(endDate).format('DD MMMM YYYY'),
      startDay,
      endDay,
      itinerary,
      background,
      host,
      travelers: [host],
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

app.get('/trips/:userId', async (req, res) => {
  const {userId} = req.params; // Assuming you have the user ID stored in req.user from authentication middleware

  console.log('user', userId);

  try {
    const trips = await Trip.find({
      $or: [{host: userId}, {travelers: userId}],
    }).populate('travelers', 'name email photo');

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

app.post('/trip/:tripId/addPlace', async (req, res) => {
  const {tripId} = req.params;
  const {placeId} = req.body;

  const API_KEY = 'AIzaSyCOZJadVuwlJvZjl_jWMjEvJDbbc17fQQI';

  try {
    // Fetch place details from Google Places API
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`;
    const response = await axios.get(url);
    const details = response.data.result;

    console.log('det', details);

    // Extract necessary details
    const placeData = {
      name: details.name,
      phoneNumber: details.formatted_phone_number,
      website: details.website,
      openingHours: details.opening_hours?.weekday_text,
      photos: details.photos?.map(
        photo =>
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${API_KEY}`,
      ),
      reviews: details.reviews?.map(review => ({
        authorName: review.author_name,
        rating: review.rating,
        text: review.text,
      })),
      types: details?.types,
      formatted_address: details?.formatted_address,
      briefDescription:
        details.editorial_summary?.overview ||
        details.reviews?.[0]?.text ||
        'No description available',
      geometry: {
        location: {
          lat: details.geometry?.location?.lat,
          lng: details.geometry?.location?.lng,
        },
        viewport: {
          northeast: {
            lat: details.geometry.viewport.northeast.lat,
            lng: details.geometry.viewport.northeast.lng,
          },
          southwest: {
            lat: details.geometry.viewport.southwest.lat,
            lng: details.geometry.viewport.southwest.lng,
          },
        },
      },
    };

    // Update the trip document with the new place
    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      {$push: {placesToVisit: placeData}},
      {new: true},
    );

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error('Error adding place to trip:', error);
    res.status(500).json({error: 'Failed to add place to trip'});
  }
});

app.get('/trip/:tripId/placesToVisit', async (req, res) => {
  const {tripId} = req.params;

  try {
    // Find the trip by ID and return only the placesToVisit array
    const trip = await Trip.findById(tripId).select('placesToVisit');

    if (!trip) {
      return res.status(404).json({error: 'Trip not found'});
    }

    res.status(200).json(trip.placesToVisit);
  } catch (error) {
    console.error('Error fetching places to visit:', error);
    res.status(500).json({error: 'Failed to fetch places to visit'});
  }
});

app.get('/trips/:tripId/places', async (req, res) => {
  try {
    const {tripId} = req.params;
    const trip = await Trip.findById(tripId).select('placesToVisit');

    if (!trip) {
      return res.status(404).json({message: 'Trip not found'});
    }

    res.status(200).json(trip.placesToVisit);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server error'});
  }
});

// Add activity to a specific day's itinerary
// Add activity to a specific day's itinerary
app.post('/trips/:tripId/itinerary/:date', async (req, res) => {
  const {tripId, date} = req.params; // Get the tripId and date from URL params
  const newActivity = req.body; // Get the activity details from the request body

  try {
    // Use findByIdAndUpdate to find the trip and update the specific itinerary entry
    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      {
        // Use $set and $push to update the activities array within the itinerary entry
        $push: {
          'itinerary.$[entry].activities': newActivity,
        },
      },
      {
        new: true, // Return the updated document
        arrayFilters: [{'entry.date': date}], // Filter to target the specific date in itinerary
      },
    );

    if (!updatedTrip) {
      return res.status(404).json({message: 'Trip not found'});
    }

    res.status(200).json({
      message: 'Activity added successfully',
      itinerary: updatedTrip.itinerary,
    });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({message: 'Internal server error'});
  }
});

app.get('/trip/:tripId/itinerary', async (req, res) => {
  const {tripId} = req.params;

  try {
    // Find the trip by ID and return only the placesToVisit array
    const trip = await Trip.findById(tripId).select('itinerary');

    if (!trip) {
      return res.status(404).json({error: 'Trip not found'});
    }

    res.status(200).json(trip.itinerary);
  } catch (error) {
    console.error('Error fetching places to visit:', error);
    res.status(500).json({error: 'Failed to fetch places to visit'});
  }
});

const JWT_SECRET = crypto.randomBytes(64).toString('hex');

app.post('/google-login', async (req, res) => {
  const {idToken} = req.body;

  try {
    // Verify the ID token with Google API
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
    );

    const {sub, email, name, given_name, family_name, picture} = response.data;

    // Check if user already exists
    let user = await User.findOne({googleId: sub});
    if (!user) {
      // Create new user if not found
      user = new User({
        googleId: sub,
        email,
        name,
        familyName: family_name,
        givenName: given_name,
        photo: picture,
      });
      await user.save();
    }

    // Create JWT token for authentication
    const token = jwt.sign({userId: user._id, email: user.email}, JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send response with the user and token
    res.status(200).json({
      message: 'Google login successful',
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({message: 'Google authentication failed', error});
  }
});

app.get('/user/:userId', async (req, res) => {
  try {
    const {userId} = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(200).json({message: 'User not found'});
    }

    return res.status(200).json({user});
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({message: 'failed to fetch user'});
  }
});

app.put('/setBudget/:tripId', async (req, res) => {
  const {tripId} = req.params;
  const {budget} = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({message: 'Trip not found'});
    }

    trip.budget = budget;
    await trip.save();

    res.status(200).json({message: 'Budget updated successfully', trip});
  } catch (error) {
    res.status(500).json({message: 'Error updating budget', error});
  }
});

app.post('/addExpense/:tripId', async (req, res) => {
  const {tripId} = req.params;
  const {category, price, paidBy, splitBy} = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({message: 'Trip not found'});
    }

    // Add the new expense to the trip's expenses array
    const newExpense = {
      category,
      price,
      paidBy,
      splitBy,
    };

    trip.expenses.push(newExpense);
    await trip.save();

    res.status(200).json({message: 'Expense added successfully', trip});
  } catch (error) {
    res.status(500).json({message: 'Error adding expense', error});
  }
});

app.get('/getExpenses/:tripId', async (req, res) => {
  const {tripId} = req.params;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({message: 'Trip not found'});
    }

    // Return only the expenses array
    res.status(200).json({expenses: trip.expenses});
  } catch (error) {
    res.status(500).json({message: 'Error fetching expenses', error});
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sujananand0@gmail.com', // Your email address
    pass: 'ryqudxkkxlhnxptz',
  },
});

app.post('/sendInviteEmail', async (req, res) => {
  const {email, tripId, tripName, senderName} = req.body;

  // Construct the email content
  const emailContent = `
    <h3>Hello,</h3>
    <p>${senderName} has invited you to join their trip "<strong>${tripName}</strong>".</p>
    <p>Click the button below to join the trip:</p>
    <a href="http://localhost:8000/joinTrip?tripId=${tripId}&email=${email}" 
      style="background-color: #4B61D1; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">
      Join Trip
    </a>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p>http://localhost:8000/joinTrip?tripId=${tripId}&email=${email}</p>
    <p>Best regards,</p>
    <p>Wanderlog team</p>
  `;

  // Send email using nodemailer
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Invitation to join the trip: ${tripName}`,
      html: emailContent, // Email content in HTML format
    });

    res.status(200).json({message: 'Invitation email sent successfully'});
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({message: 'Error sending invitation email', error});
  }
});

// Add User to Travelers List
app.get('/joinTrip', async (req, res) => {
  const {tripId, email} = req.query;

  try {
    console.log('trip', tripId);
    console.log('email', email);
    const normalizedEmail = email.toLowerCase();
    // Find the user by email
    const user = await User.findOne({email: normalizedEmail});
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Find the trip by tripId
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({message: 'Trip not found'});
    }

    // Check if the user is already in the travelers list
    if (trip.travelers.includes(user._id)) {
      return res.status(400).json({message: 'User is already a traveler'});
    }

    // Add the user to the travelers array
    trip.travelers.push(user._id);
    await trip.save();

    res
      .status(200)
      .json({message: 'You have been successfully added to the trip'});
  } catch (error) {
    res.status(500).json({message: 'Error adding user to trip', error});
  }
});
