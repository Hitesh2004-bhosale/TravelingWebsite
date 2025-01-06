const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();


const app = express();

// Middlewares
app.use(cors());  // Enable CORS
app.use(express.json({ limit: '100mb' }));  // Increase request body size limit
app.use(express.urlencoded({ limit: '100mb', extended: true }));  // Handle URL-encoded data



// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const HotelSchema = new mongoose.Schema({
  image: String,
  name: String,
  location: String,
  price: Number,
  description: String,
});

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Linking to the user
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }, // Linking to the hotel
  text: String,
  rating: Number,
  date: { type: Date, default: Date.now },
});
const BookingSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },  // Linking to the hotel
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },    // Linking to the user
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  mobileNumber: { type: String, required: true },
  numberOfPersons: { type: Number, required: true },
  scannedImage: { type: String }, // URL of the uploaded image
  totalPrice: { type: Number, required: true }, // Calculated total cost
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Hotel = mongoose.model('Hotel', HotelSchema);
const Comment = mongoose.model('Comment', CommentSchema);
const Booking = mongoose.model('Booking', BookingSchema);

// User signup route
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// User login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Get user profile route (protected)
app.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user by the ID decoded from the JWT token
    const user = await User.findById(decoded.id);

    if (user) {
      // Return profile data (without returning the password)
      res.json({
        username: user.username,
        email: user.email,
        // Exclude the password for security reasons
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add hotel route
app.post('/add-hotel', async (req, res) => {
  try {
    const { image, name, location, price, description } = req.body;
    const newHotel = new Hotel({ image, name, location, price, description });
    await newHotel.save();
    res.json({ message: 'Hotel added successfully' });
  } catch (err) {
    console.error('Error adding hotel:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all hotels route
app.get('/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find({});
    res.json(hotels);
  } catch (err) {
    console.error('Error fetching hotels:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Search hotels route
app.get('/search', async (req, res) => {
  const { location, name } = req.query;
  try {
    const filter = {};
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (name) filter.name = { $regex: name, $options: 'i' };

    const hotels = await Hotel.find(filter);
    res.json(hotels);
  } catch (err) {
    console.error('Error fetching hotels:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get comments for a specific hotel
app.get('/hotel/:id/comments', async (req, res) => {
  const hotelId = req.params.id;
  try {
    const comments = await Comment.find({ hotelId })
      .populate('userId', 'username')  // Populate username from the User model
      .exec();
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Post a comment for a hotel (protected)
app.post('/hotel/:id/comments', async (req, res) => {
  const hotelId = req.params.id;
  const { text, rating } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newComment = new Comment({
      userId: user._id,
      hotelId,
      text,
      rating,
    });

    await newComment.save();
    res.json({ message: 'Comment posted successfully' });
  } catch (err) {
    console.error('Error posting comment:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.use(express.json({ limit: '10mb' })); // Adjust the size limit as needed



// Assuming that you have a Booking model that stores hotelId and other details.
// Also assuming that you have a Hotel model where each hotel has details like name, location, price.
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
console.log(bookings);
    const hotelList = await Promise.all(bookings.map(async (booking) => {
      const hotel = await Hotel.findById(booking.hotelId);
      if (!hotel) {
        throw new Error(`Hotel not found for booking with ID: ${booking._id}`);
      }

      let bookingDate = new Date(booking.bookingDate);
      if (isNaN(bookingDate)) {
        bookingDate = new Date(); // Use current date if invalid
      }

      return {
        ...booking.toObject(),
        hotel: {
          name: hotel.name,
          location: hotel.location,
          price: hotel.price
        },
        bookingDate: bookingDate.toISOString(), // Ensure booking date is correctly formatted
        mobile: booking. mobileNumber || 'N/A'  // Include mobile number, default to 'N/A' if missing
      };
    }));

    res.json(hotelList); // Return the list with bookings and hotel details
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
});

// Booking route with date conflict check (protected)
app.post('/book-hotel/:id', async (req, res) => {
  const hotelId = req.params.id;
  const { startDate, endDate, mobileNumber, numberOfPersons, scannedImage } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const overlappingBooking = await Booking.findOne({
      hotelId,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: `Hotel is already booked for the selected dates. Please choose a different period.`
      });
    }

    const totalPrice = hotel.price * numberOfPersons;
    const newBooking = new Booking({
      hotelId,
      userId: user._id,
      startDate,
      endDate,
      mobileNumber,
      numberOfPersons,
      scannedImage,
      totalPrice
    });

    await newBooking.save();
    res.json({ message: 'Booking successful', booking: newBooking });
  } catch (err) {
    console.error('Error during booking:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




// Change Password route (protected)
app.put('/change-password', async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // Decode the JWT token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify if the current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirmation do not match' });
    }

    // Hash the new password and update the user record
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});






// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
