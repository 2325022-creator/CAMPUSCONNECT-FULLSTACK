import React, { useReducer } from 'react';
import './App.css';

// 1. Initial State
const initialState = {
  events: [
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
  ],
  favorites: ['1'],
  activeTab: 'home', // 'home', 'events', 'register', 'favorites'
  searchQuery: '',
  selectedCategory: 'All Categories',
  selectedEventDetail: null,
  newEvent: { title: '', category: 'Tech', date: '', venue: '', description: '' },
  regForm: {
    fullName: '',
    email: '',
    department: '',
    yearOfStudy: '',
    password: '',
    attendance: 'In-person',
    eventId: '',
    accessibility: false,
    message: ''
  },
  registrationSuccess: null
};

// 2. Reducer Function (State update rules in one central place)
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.payload, selectedEventDetail: null };

    case 'TOGGLE_FAVORITE':
      const isFav = state.favorites.includes(action.payload);
      return {
        ...state,
        favorites: isFav
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload]
      };

    case 'SET_NEW_EVENT_FIELD':
      return {
        ...state,
        newEvent: { ...state.newEvent, [action.field]: action.value }
      };

    case 'ADD_EVENT':
      const createdEvent = {
        id: String(state.events.length + 1),
        title: state.newEvent.title,
        category: state.newEvent.category.toUpperCase(),
        date: state.newEvent.date,
        venue: state.newEvent.venue,
        description: state.newEvent.description,
        registrations: 0
      };
      return {
        ...state,
        events: [...state.events, createdEvent],
        newEvent: { title: '', category: 'Tech', date: '', venue: '', description: '' }
      };

    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(ev => ev.id !== action.payload),
        favorites: state.favorites.filter(id => id !== action.payload)
      };

    case 'SET_REG_FIELD':
      return {
        ...state,
        regForm: { ...state.regForm, [action.field]: action.value }
      };

    case 'RESET_REG_FORM':
      return {
        ...state,
        regForm: {
          fullName: '',
          email: '',
          department: '',
          yearOfStudy: '',
          password: '',
          attendance: 'In-person',
          eventId: '',
          accessibility: false,
          message: ''
        }
      };

    case 'SUBMIT_REGISTRATION':
      const chosenEvent = state.events.find(ev => ev.id === state.regForm.eventId);
      return {
        ...state,
        events: state.events.map(ev =>
          ev.id === state.regForm.eventId ? { ...ev, registrations: ev.registrations + 1 } : ev
        ),
        registrationSuccess: {
          studentName: state.regForm.fullName,
          email: state.regForm.email,
          department: state.regForm.department || 'Computer Science',
          eventTitle: chosenEvent ? chosenEvent.title : 'Selected Event',
          attendance: state.regForm.attendance
        }
      };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'SET_CATEGORY_FILTER':
      return { ...state, selectedCategory: action.payload };

    case 'RESET_FILTERS':
      return { ...state, searchQuery: '', selectedCategory: 'All Categories' };

    case 'SET_EVENT_DETAIL':
      return { ...state, selectedEventDetail: action.payload };

    default:
      return state;
  }
}

function App() {
  // 3. Action Dispatcher
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Handlers using dispatch({ type: '...' })
  const handleAddEventSubmit = (e) => {
    e.preventDefault();
    if (!state.newEvent.title || !state.newEvent.date || !state.newEvent.venue) return;
    dispatch({ type: 'ADD_EVENT' });
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_REGISTRATION' });
  };

  // Filter Logic
  const filteredEvents = state.events.filter(ev => {
    const matchesQuery = ev.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                         ev.venue.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchesCategory = state.selectedCategory === 'All Categories' || ev.category.toLowerCase() === state.selectedCategory.toLowerCase();
    return matchesQuery && matchesCategory;
  });

  const favoriteEventsList = state.events.filter(ev => state.favorites.includes(ev.id));

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand">CampusConnect</div>
        <div className="nav-menu">
          <a href="#home" onClick={() => dispatch({ type: 'SET_TAB', payload: 'home' })}>Home</a>
          <a href="#events" onClick={() => dispatch({ type: 'SET_TAB', payload: 'events' })}>Events</a>
          <a href="#register" onClick={() => dispatch({ type: 'SET_TAB', payload: 'register' })}>Register</a>
          <button 
            className={`fav-badge-btn ${state.activeTab === 'favorites' ? 'fav-active-btn' : ''}`}
            onClick={() => dispatch({ type: 'SET_TAB', payload: 'favorites' })}
          >
            Favorites ({state.favorites.length})
          </button>
        </div>
      </nav>

      {/* VIEW DETAILS */}
      {state.selectedEventDetail ? (
        <main className="main-wrapper">
          <button className="btn btn-light btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => dispatch({ type: 'SET_EVENT_DETAIL', payload: null })}>
            Back to Events
          </button>

          <div className="event-detail-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge-tag">{state.selectedEventDetail.category}</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Event ID: #{state.selectedEventDetail.id}</span>
            </div>

            <h1 style={{ fontSize: '2rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>{state.selectedEventDetail.title}</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{state.selectedEventDetail.description}</p>

            <div className="gray-meta-box">
              <p><strong>Date:</strong> {state.selectedEventDetail.date}</p>
              <p style={{ marginTop: '0.4rem' }}><strong>Venue:</strong> {state.selectedEventDetail.venue}</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  dispatch({ type: 'SET_REG_FIELD', field: 'eventId', value: state.selectedEventDetail.id });
                  dispatch({ type: 'SET_TAB', payload: 'register' });
                }}
              >
                Register for this Event
              </button>
              <button className="btn btn-light" onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', payload: state.selectedEventDetail.id })}>
                {state.favorites.includes(state.selectedEventDetail.id) ? 'Favorited' : 'Add Favorite'}
              </button>
            </div>
          </div>
        </main>
      ) : state.activeTab === 'favorites' ? (
        /* FAVORITES PAGE */
        <main className="main-wrapper">
          <p className="section-tag">SAVED EVENTS</p>
          <h2 className="section-heading">Your Favorite Events</h2>
          <p className="section-subheading">Manage and access all your saved events in one place.</p>

          {favoriteEventsList.length === 0 ? (
            <div className="favorites-empty-box">
              <h3>No favorite events saved yet.</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Browse upcoming events and click "Add Favorite" to add them here.</p>
              <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={() => dispatch({ type: 'SET_TAB', payload: 'events' })}>
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
                          dispatch({ type: 'SET_REG_FIELD', field: 'eventId', value: item.id });
                          dispatch({ type: 'SET_TAB', payload: 'register' });
                        }}
                      >
                        Register
                      </button>
                      <button className="btn btn-danger-light btn-sm" onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', payload: item.id })}>
                        Remove Favorite
                      </button>
                    </div>

                    <div className="action-row-secondary">
                      <button className="btn btn-dark btn-xs" onClick={() => dispatch({ type: 'SET_EVENT_DETAIL', payload: item })}>
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
        /* MAIN LANDING PAGE */
        <>
          <header id="home" className="hero-container">
            <p className="hero-subtitle">YOUR CAMPUS, YOUR COMMUNITY</p>
            <h1 className="hero-title">Make Your Campus Experience Count.</h1>
            <p className="hero-desc">Discover exciting events, meet new people, and make the most of your college life.</p>
            <div className="hero-actions">
              <a href="#events" className="btn btn-primary" onClick={() => dispatch({ type: 'SET_TAB', payload: 'events' })}>Explore Events</a>
              <a href="#register" className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_TAB', payload: 'register' })}>Register for an Event</a>
            </div>
          </header>

          <main className="main-wrapper">
            <section id="events">
              <p className="section-tag">DISCOVER YOUR CAMPUS</p>
              <h2 className="section-heading">Upcoming Events</h2>
              <p className="section-subheading">Find opportunities to learn, connect, and participate.</p>

              <div className="content-card">
                <h3 className="card-title">Add a New Event</h3>
                <p className="card-subtitle">Fill in the event details below.</p>

                <form onSubmit={handleAddEventSubmit} className="form-grid">
                  <div className="form-field">
                    <label>Event title *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. React Workshop" 
                      value={state.newEvent.title} 
                      onChange={e => dispatch({ type: 'SET_NEW_EVENT_FIELD', field: 'title', value: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-field">
                    <label>Category *</label>
                    <select value={state.newEvent.category} onChange={e => dispatch({ type: 'SET_NEW_EVENT_FIELD', field: 'category', value: e.target.value })}>
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
                      value={state.newEvent.date} 
                      onChange={e => dispatch({ type: 'SET_NEW_EVENT_FIELD', field: 'date', value: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-field">
                    <label>Venue *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Seminar Hall" 
                      value={state.newEvent.venue} 
                      onChange={e => dispatch({ type: 'SET_NEW_EVENT_FIELD', field: 'venue', value: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-field col-span-2">
                    <label>Description *</label>
                    <textarea 
                      placeholder="Describe the event" 
                      value={state.newEvent.description} 
                      onChange={e => dispatch({ type: 'SET_NEW_EVENT_FIELD', field: 'description', value: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="col-span-2">
                    <button type="submit" className="btn btn-primary">Add Event</button>
                  </div>
                </form>
              </div>

              <div className="filter-row">
                <input 
                  type="text" 
                  className="filter-input" 
                  placeholder="Search events by title or venue..." 
                  value={state.searchQuery} 
                  onChange={e => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })} 
                />
                <select className="filter-select" value={state.selectedCategory} onChange={e => dispatch({ type: 'SET_CATEGORY_FILTER', payload: e.target.value })}>
                  <option value="All Categories">All Categories</option>
                  <option value="Tech">Tech</option>
                  <option value="Culture">Culture</option>
                  <option value="Design">Design</option>
                </select>
                <button className="btn btn-light" onClick={() => dispatch({ type: 'RESET_FILTERS' })}>
                  Reset Filters
                </button>
              </div>

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
                            dispatch({ type: 'SET_REG_FIELD', field: 'eventId', value: item.id });
                            dispatch({ type: 'SET_TAB', payload: 'register' });
                          }}
                        >
                          Register
                        </button>
                        <button className="btn btn-yellow-light btn-sm" onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', payload: item.id })}>
                          {state.favorites.includes(item.id) ? 'Favorited' : 'Add Favorite'}
                        </button>
                      </div>

                      <div className="action-row-secondary">
                        <button className="btn btn-dark btn-xs" onClick={() => dispatch({ type: 'SET_EVENT_DETAIL', payload: item })}>
                          View Details
                        </button>
                        <button className="btn btn-light btn-xs">Edit Event</button>
                        <button className="btn btn-danger-light btn-xs" onClick={() => dispatch({ type: 'DELETE_EVENT', payload: item.id })}>
                          Delete Event
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

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
                      value={state.regForm.fullName} 
                      onChange={e => dispatch({ type: 'SET_REG_FIELD', field: 'fullName', value: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-field">
                    <label>Email address *</label>
                    <input 
                      type="email" 
                      placeholder="student@example.com" 
                      value={state.regForm.email} 
                      onChange={e => dispatch({ type: 'SET_REG_FIELD', field: 'email', value: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-field">
                    <label>Department *</label>
                    <select value={state.regForm.department} onChange={e => dispatch({ type: 'SET_REG_FIELD', field: 'department', value: e.target.value })} required>
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
                      value={state.regForm.yearOfStudy} 
                      onChange={e => dispatch({ type: 'SET_REG_FIELD', field: 'yearOfStudy', value: e.target.value })} 
                    />
                  </div>

                  <div className="form-field">
                    <label>Create a demo password (optional)</label>
                    <input 
                      type="password" 
                      placeholder="Password input example" 
                      value={state.regForm.password} 
                      onChange={e => dispatch({ type: 'SET_REG_FIELD', field: 'password', value: e.target.value })} 
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
                          checked={state.regForm.attendance === 'In-person'} 
                          onChange={e => dispatch({ type: 'SET_REG_FIELD', field: 'attendance', value: e.target.value })} 
                        /> In-person
                      </label>
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="attMode" 
                          value="Online" 
                          checked={state.regForm.attendance === 'Online'} 
                          onChange={e => dispatch({ type: 'SET_REG_FIELD', field: 'attendance', value: e.target.value })} 
                        /> Online
                      </label>
                    </div>
                  </div>

                  <div className="form-field col-span-2">
                    <label>Choose an event *</label>
                    <select value={state.regForm.eventId} onChange={e => dispatch({ type: 'SET_REG_FIELD', field: 'eventId', value: e.target.value })} required>
                      <option value="">Select a campus event</option>
                      {state.events.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={state.regForm.accessibility} 
                        onChange={e => dispatch({ type: 'SET_REG_FIELD', field: 'accessibility', value: e.target.checked })} 
                      /> I would like the team to contact me about accessibility support.
                    </label>
                  </div>

                  <div className="form-field col-span-2">
                    <label>Message (optional)</label>
                    <textarea 
                      placeholder="Any questions or notes for the event team?" 
                      value={state.regForm.message} 
                      onChange={e => dispatch({ type: 'SET_REG_FIELD', field: 'message', value: e.target.value })} 
                    />
                  </div>

                  <div className="col-span-2" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary">Submit Registration</button>
                    <button 
                      type="button" 
                      className="btn btn-light" 
                      onClick={() => dispatch({ type: 'RESET_REG_FORM' })}
                    >
                      Reset Form
                    </button>
                  </div>
                </form>

                {state.registrationSuccess && (
                  <div className="confirmation-card">
                    <h4>Registration complete!</h4>
                    <p className="demo-subtext">This is a local demonstration. Your details have not been sent to a server.</p>
                    <ul>
                      <li>• <strong>Student:</strong> {state.registrationSuccess.studentName}</li>
                      <li>• <strong>Email:</strong> {state.registrationSuccess.email}</li>
                      <li>• <strong>Department:</strong> {state.registrationSuccess.department}</li>
                      <li>• <strong>Event:</strong> {state.registrationSuccess.eventTitle}</li>
                      <li>• <strong>Attendance:</strong> {state.registrationSuccess.attendance}</li>
                    </ul>
                  </div>
                )}
              </div>
            </section>
          </main>
        </>
      )}

      <footer className="app-footer">
        <div className="footer-brand">CampusConnect</div>
        <p className="footer-sub">Discover events. Meet people. Make memories.</p>
        <p className="footer-sub" style={{ marginTop: '0.25rem' }}>© 2026 CampusConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;