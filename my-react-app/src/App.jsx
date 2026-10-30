import React, { useState } from 'react';
import './App.css';

function App() {
  // Base State for Events
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Cultural Day',
      category: 'CULTURE',
      date: '2026-11-12',
      venue: 'Open Air Stage',
      description: 'Celebrate music, dance, art, and cultures from across campus.',
      registrations: 0
    },
    {
      id: '2',
      title: 'Web Design Session',
      category: 'DESIGN',
      date: '2026-11-20',
      venue: 'Computer Lab 3',
      description: 'Learn the basics of web design and create your first page layout.',
      registrations: 0
    }
  ]);

  const [favorites, setFavorites] = useState(['1']); // Initial favorite item
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'events', 'register', 'favorites'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  // View Details Modal/Page State
  const [selectedEventDetail, setSelectedEventDetail] = useState(null);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Tech',
    date: '',
    venue: '',
    description: ''
  });

  // Student Registration Form State
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    department: '',
    yearOfStudy: '',
    password: '',
    attendance: 'In-person',
    eventId: '',
    accessibility: false,
    message: ''
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  // Favorites Toggle
  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Add Event Handler
  const handleAddEventSubmit = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.venue) return;

    const created = {
      id: String(events.length + 1),
      title: newEvent.title,
      category: newEvent.category.toUpperCase(),
      date: newEvent.date,
      venue: newEvent.venue,
      description: newEvent.description,
      registrations: 0
    };

    setEvents([...events, created]);
    setNewEvent({ title: '', category: 'Tech', date: '', venue: '', description: '' });
  };

  // Delete Event Handler
  const handleDeleteEvent = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
    setFavorites(favorites.filter(favId => favId !== id));
  };

  // Registration Submit Handler
  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    const chosen = events.find(ev => ev.id === regForm.eventId);

    // Increment registration counter
    setEvents(events.map(ev => 
      ev.id === regForm.eventId ? { ...ev, registrations: ev.registrations + 1 } : ev
    ));

    setRegistrationSuccess({
      studentName: regForm.fullName,
      email: regForm.email,
      department: regForm.department || 'Computer Science',
      eventTitle: chosen ? chosen.title : 'Selected Event',
      attendance: regForm.attendance
    });
  };

  // Filter Logic for Events
  const filteredEvents = events.filter(ev => {
    const matchesQuery = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ev.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || ev.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesQuery && matchesCategory;
  });

  // Favorite Events List
  const favoriteEventsList = events.filter(ev => favorites.includes(ev.id));

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand">CampusConnect</div>
        <div className="nav-menu">
          <a href="#home" onClick={() => { setActiveTab('home'); setSelectedEventDetail(null); }}>Home</a>
          <a href="#events" onClick={() => { setActiveTab('events'); setSelectedEventDetail(null); }}>Events</a>
          <a href="#register" onClick={() => { setActiveTab('register'); setSelectedEventDetail(null); }}>Register</a>
          <button 
            className={`fav-badge-btn ${activeTab === 'favorites' ? 'fav-active-btn' : ''}`}
            onClick={() => { setActiveTab('favorites'); setSelectedEventDetail(null); }}
          >
            Favorites ({favorites.length})
          </button>
        </div>
      </nav>

      {/* VIEW DETAILS SINGLE PAGE VIEW */}
      {selectedEventDetail ? (
        <main className="main-wrapper">
          <button className="btn btn-light btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => setSelectedEventDetail(null)}>
            Back to Events
          </button>

          <div className="event-detail-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge-tag">{selectedEventDetail.category}</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Event ID: #{selectedEventDetail.id}</span>
            </div>

            <h1 style={{ fontSize: '2rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>{selectedEventDetail.title}</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{selectedEventDetail.description}</p>

            <div className="gray-meta-box">
              <p><strong>Date:</strong> {selectedEventDetail.date}</p>
              <p style={{ marginTop: '0.4rem' }}><strong>Venue:</strong> {selectedEventDetail.venue}</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setRegForm({ ...regForm, eventId: selectedEventDetail.id });
                  setActiveTab('register');
                  setSelectedEventDetail(null);
                }}
              >
                Register for this Event
              </button>
              <button className="btn btn-light" onClick={() => toggleFavorite(selectedEventDetail.id)}>
                {favorites.includes(selectedEventDetail.id) ? 'Favorited' : 'Add Favorite'}
              </button>
            </div>
          </div>
        </main>
      ) : activeTab === 'favorites' ? (
        /* DEDICATED FAVORITES PAGE */
        <main className="main-wrapper">
          <p className="section-tag">SAVED EVENTS</p>
          <h2 className="section-heading">Your Favorite Events</h2>
          <p className="section-subheading">Manage and access all your saved events in one place.</p>

          {favoriteEventsList.length === 0 ? (
            <div className="favorites-empty-box">
              <h3>No favorite events saved yet.</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Browse upcoming events and click "Add Favorite" to add them here.</p>
              <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={() => setActiveTab('events')}>
                Explore Events
              </button>
            </div>
          ) : (
            <div className="events-grid-layout">
              {favoriteEventsList.map(item => (
                <div key={item.id} className="event-item-card">
                  <div className="event-category-sidebar">{item.category}</div>
                  <div className="event-details-body">
                    <h3 className="event-item-title">{item.title}</h3>
                    <p className="event-item-desc">{item.description}</p>
                    <p className="meta-text"><strong>Date:</strong> {item.date}</p>
                    <p className="meta-text"><strong>Venue:</strong> {item.venue}</p>
                    <p className="meta-text"><strong>Registrations:</strong> {item.registrations}</p>
                    <p className="meta-text"><strong>Event ID:</strong> {item.id}</p>

                    <div className="action-row-primary">
                      <button 
                        className="btn btn-blue-light btn-sm" 
                        onClick={() => {
                          setRegForm({ ...regForm, eventId: item.id });
                          setActiveTab('register');
                        }}
                      >
                        Register
                      </button>
                      <button className="btn btn-danger-light btn-sm" onClick={() => toggleFavorite(item.id)}>
                        Remove Favorite
                      </button>
                    </div>

                    <div className="action-row-secondary">
                      <button className="btn btn-dark btn-xs" onClick={() => setSelectedEventDetail(item)}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      ) : (
        /* MAIN LANDING PAGE VIEW */
        <>
          {/* Hero Section */}
          <header id="home" className="hero-container">
            <p className="hero-subtitle">YOUR CAMPUS, YOUR COMMUNITY</p>
            <h1 className="hero-title">Make Your Campus Experience Count.</h1>
            <p className="hero-desc">Discover exciting events, meet new people, and make the most of your college life.</p>
            <div className="hero-actions">
              <a href="#events" className="btn btn-primary" onClick={() => setActiveTab('events')}>Explore Events</a>
              <a href="#register" className="btn btn-secondary" onClick={() => setActiveTab('register')}>Register for an Event</a>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="main-wrapper">
            {/* Events Section */}
            <section id="events">
              <p className="section-tag">DISCOVER YOUR CAMPUS</p>
              <h2 className="section-heading">Upcoming Events</h2>
              <p className="section-subheading">Find opportunities to learn, connect, and participate.</p>

              {/* Add New Event Card */}
              <div className="content-card">
                <h3 className="card-title">Add a New Event</h3>
                <p className="card-subtitle">Fill in the event details below.</p>

                <form onSubmit={handleAddEventSubmit} className="form-grid">
                  <div className="form-field">
                    <label>Event title *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. React Workshop" 
                      value={newEvent.title} 
                      onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-field">
                    <label>Category *</label>
                    <select value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}>
                      <option value="Tech">Tech</option>
                      <option value="Culture">Culture</option>
                      <option value="Design">Design</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Date *</label>
                    <input 
                      type="date" 
                      value={newEvent.date} 
                      onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-field">
                    <label>Venue *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Seminar Hall" 
                      value={newEvent.venue} 
                      onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-field col-span-2">
                    <label>Description *</label>
                    <textarea 
                      placeholder="Describe the event" 
                      value={newEvent.description} 
                      onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="col-span-2">
                    <button type="submit" className="btn btn-primary">Add Event</button>
                  </div>
                </form>
              </div>

              {/* Search & Filter Bar */}
              <div className="filter-row">
                <input 
                  type="text" 
                  className="filter-input" 
                  placeholder="Search events by title or venue..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                />
                <select className="filter-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                  <option value="All Categories">All Categories</option>
                  <option value="Tech">Tech</option>
                  <option value="Culture">Culture</option>
                  <option value="Design">Design</option>
                </select>
                <button className="btn btn-light" onClick={() => { setSearchQuery(''); setSelectedCategory('All Categories'); }}>
                  Reset Filters
                </button>
              </div>

              {/* Events Grid */}
              <div className="events-grid-layout">
                {filteredEvents.map(item => (
                  <div key={item.id} className="event-item-card">
                    <div className="event-category-sidebar">{item.category}</div>
                    <div className="event-details-body">
                      <h3 className="event-item-title">{item.title}</h3>
                      <p className="event-item-desc">{item.description}</p>
                      <p className="meta-text"><strong>Date:</strong> {item.date}</p>
                      <p className="meta-text"><strong>Venue:</strong> {item.venue}</p>
                      <p className="meta-text"><strong>Registrations:</strong> {item.registrations}</p>
                      <p className="meta-text"><strong>Event ID:</strong> {item.id}</p>

                      <div className="action-row-primary">
                        <button 
                          className="btn btn-blue-light btn-sm" 
                          onClick={() => {
                            setRegForm({ ...regForm, eventId: item.id });
                            setActiveTab('register');
                          }}
                        >
                          Register
                        </button>
                        <button className="btn btn-yellow-light btn-sm" onClick={() => toggleFavorite(item.id)}>
                          {favorites.includes(item.id) ? 'Favorited' : 'Add Favorite'}
                        </button>
                      </div>

                      <div className="action-row-secondary">
                        <button className="btn btn-dark btn-xs" onClick={() => setSelectedEventDetail(item)}>
                          View Details
                        </button>
                        <button className="btn btn-light btn-xs">Edit Event</button>
                        <button className="btn btn-danger-light btn-xs" onClick={() => handleDeleteEvent(item.id)}>
                          Delete Event
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Student Registration Section */}
            <section id="register" style={{ marginTop: '4rem' }}>
              <p className="section-tag">SAVE YOUR SPOT</p>
              <h2 className="section-heading">Student Event Registration</h2>
              <p className="section-subheading">Complete the required fields to register for a campus event.</p>

              <div className="content-card">
                <form onSubmit={handleRegistrationSubmit} className="form-grid">
                  <div className="form-field">
                    <label>Student name *</label>
                    <input 
                      type="text" 
                      placeholder="Enter your full name" 
                      value={regForm.fullName} 
                      onChange={e => setRegForm({ ...regForm, fullName: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-field">
                    <label>Email address *</label>
                    <input 
                      type="email" 
                      placeholder="student@example.com" 
                      value={regForm.email} 
                      onChange={e => setRegForm({ ...regForm, email: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-field">
                    <label>Department *</label>
                    <select value={regForm.department} onChange={e => setRegForm({ ...regForm, department: e.target.value })} required>
                      <option value="">Select your department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Year of study</label>
                    <input 
                      type="text" 
                      placeholder="Example: 2" 
                      value={regForm.yearOfStudy} 
                      onChange={e => setRegForm({ ...regForm, yearOfStudy: e.target.value })} 
                    />
                  </div>

                  <div className="form-field">
                    <label>Create a demo password (optional)</label>
                    <input 
                      type="password" 
                      placeholder="Password input example" 
                      value={regForm.password} 
                      onChange={e => setRegForm({ ...regForm, password: e.target.value })} 
                    />
                    <span className="field-hint">This is a learning component to demonstrate input UI.</span>
                  </div>

                  <div className="form-field">
                    <label>How will you attend? *</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="attMode" 
                          value="In-person" 
                          checked={regForm.attendance === 'In-person'} 
                          onChange={e => setRegForm({ ...regForm, attendance: e.target.value })} 
                        /> In-person
                      </label>
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="attMode" 
                          value="Online" 
                          checked={regForm.attendance === 'Online'} 
                          onChange={e => setRegForm({ ...regForm, attendance: e.target.value })} 
                        /> Online
                      </label>
                    </div>
                  </div>

                  <div className="form-field col-span-2">
                    <label>Choose an event *</label>
                    <select value={regForm.eventId} onChange={e => setRegForm({ ...regForm, eventId: e.target.value })} required>
                      <option value="">Select a campus event</option>
                      {events.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={regForm.accessibility} 
                        onChange={e => setRegForm({ ...regForm, accessibility: e.target.checked })} 
                      /> I would like the team to contact me about accessibility support.
                    </label>
                  </div>

                  <div className="form-field col-span-2">
                    <label>Message (optional)</label>
                    <textarea 
                      placeholder="Any questions or notes for the event team?" 
                      value={regForm.message} 
                      onChange={e => setRegForm({ ...regForm, message: e.target.value })} 
                    />
                  </div>

                  <div className="col-span-2" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary">Submit Registration</button>
                    <button 
                      type="button" 
                      className="btn btn-light" 
                      onClick={() => setRegForm({
                        fullName: '',
                        email: '',
                        department: '',
                        yearOfStudy: '',
                        password: '',
                        attendance: 'In-person',
                        eventId: '',
                        accessibility: false,
                        message: ''
                      })}
                    >
                      Reset Form
                    </button>
                  </div>
                </form>

                {/* Registration Confirmation Banner */}
                {registrationSuccess && (
                  <div className="confirmation-card">
                    <h4>Registration complete!</h4>
                    <p className="demo-subtext">This is a local demonstration. Your details have not been sent to a server.</p>
                    <ul>
                      <li>• <strong>Student:</strong> {registrationSuccess.studentName}</li>
                      <li>• <strong>Email:</strong> {registrationSuccess.email}</li>
                      <li>• <strong>Department:</strong> {registrationSuccess.department}</li>
                      <li>• <strong>Event:</strong> {registrationSuccess.eventTitle}</li>
                      <li>• <strong>Attendance:</strong> {registrationSuccess.attendance}</li>
                    </ul>
                  </div>
                )}
              </div>
            </section>
          </main>
        </>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-brand">CampusConnect</div>
        <p className="footer-sub">Discover events. Meet people. Make memories.</p>
        <p className="footer-sub" style={{ marginTop: '0.25rem' }}>© 2026 CampusConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;