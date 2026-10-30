import { useState } from 'react';
import './Eventcard.css';

export default function Eventcard({ event, onRegisterClick, onDelete }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="event-card">
      <div className="card-banner">{event.category}</div>
      <div className="card-body">
        <div className="card-category">{event.category}</div>
        <h3 className="card-title">{event.title}</h3>
        <p className="card-desc">{event.description}</p>
        <p className="card-info">
          <strong>Date:</strong> {event.date}
        </p>
        <p className="card-info">
          <strong>Venue:</strong> {event.venue}
        </p>
        <p className="card-info">
          <strong>Registrations:</strong> {event.registrationsCount}
        </p>
        <div className="card-actions">
          <button className="btn-blue" onClick={() => onRegisterClick(event.title)}>
            Register
          </button>
          <button className="btn-yellow" onClick={() => setIsFavorite(!isFavorite)}>
            {isFavorite ? '★ Favorited' : 'Add Favorite'}
          </button>
          <button className="btn-red" onClick={() => onDelete(event._id)}>
            Remove Event
          </button>
        </div>
      </div>
    </div>
  );
}