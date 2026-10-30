import Eventcard from './Eventcard';
import './Eventlist.css';

export default function Eventlist({ events, onRegisterClick, onSeedEvents, onDeleteEvent }) {
  return (
    <section className="section-container">
      <div className="events-header">
        <div className="subtitle-badge">Discover Your Campus</div>
        <h2 style={{ fontSize: '2.2rem', margin: '8px 0', color: '#0f172a' }}>
          Upcoming Events
        </h2>
        <p style={{ color: '#64748b' }}>
          Find opportunities to learn, connect, and participate.
        </p>
        <button className="btn-dark" onClick={onSeedEvents}>
          Add Sample Event
        </button>
      </div>

      <div className="event-grid">
        {events.map((evt) => (
          <Eventcard
            key={evt._id}
            event={evt}
            onRegisterClick={onRegisterClick}
            onDelete={onDeleteEvent}
          />
        ))}
      </div>
    </section>
  );
}