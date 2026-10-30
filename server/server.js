const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed default events
app.post('/api/events/seed', async (req, res) => {
  try {
    const initialEvents = [
      {
        title: 'Cultural Day',
        category: 'CULTURE',
        description: 'Celebrate music, dance, art, and cultures from across campus.',
        date: 'November 12, 2026',
        venue: 'Open Air Stage',
        registrationsCount: 0
      },
      {
        title: 'Sports Meet',
        category: 'SPORTS',
        description: 'Join exciting games and sports competitions with your friends.',
        date: 'November 18, 2026',
        venue: 'College Sports Ground',
        registrationsCount: 0
      },
      {
        title: 'Tech Symposium',
        category: 'TECHNOLOGY',
        description: 'Explore technology, coding competitions, and innovative projects.',
        date: 'November 22, 2026',
        venue: 'Main Auditorium',
        registrationsCount: 0
      }
    ];
    await Event.deleteMany({});
    const createdEvents = await Event.insertMany(initialEvents);
    res.status(201).json(createdEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an event
app.delete('/api/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit registration and increment counter
app.post('/api/register', async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();

    await Event.updateOne(
      { title: req.body.event },
      { $inc: { registrationsCount: 1 } }
    );

    res.status(201).json({ message: 'Registration Successful!', registration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));