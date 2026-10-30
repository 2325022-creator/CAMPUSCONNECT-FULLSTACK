import { useState, useEffect } from 'react';
import './StudentForm.css';

export default function StudentForm({ selectedEventTitle, events, onRegistrationSuccess }) {
  const initialFormState = {
    studentName: '',
    registerNumber: '',
    department: '',
    email: '',
    phone: '',
    event: selectedEventTitle || '',
    eventDate: '2026-10-08',
    participationType: 'Individual',
    additionalDetails: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    if (selectedEventTitle) {
      setFormData((prev) => ({ ...prev, event: selectedEventTitle }));
    }
  }, [selectedEventTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData(initialFormState);
    setSubmittedData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setSubmittedData(formData);
        if (onRegistrationSuccess) onRegistrationSuccess();
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="form-wrapper" id="student-form-section">
      <div className="form-header">
        <h2>College Campus Events</h2>
        <p>Student Registration Form</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student Name:</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Register Number:</label>
          <input
            type="text"
            name="registerNumber"
            value={formData.registerNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Department:</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
          </select>
        </div>

        <div className="form-group">
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Select Event:</label>
          <select
            name="event"
            value={formData.event}
            onChange={handleChange}
            required
          >
            <option value="">Select Event</option>
            {events && events.map((evt) => (
              <option key={evt._id || evt.title} value={evt.title}>
                {evt.title}
              </option>
            ))}
            <option value="Quiz Competition">Quiz Competition</option>
          </select>
        </div>

        <div className="form-group">
          <label>Event Date:</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Participation Type:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="participationType"
                value="Individual"
                checked={formData.participationType === 'Individual'}
                onChange={handleChange}
              />{' '}
              Individual
            </label>
            <label>
              <input
                type="radio"
                name="participationType"
                value="Team"
                checked={formData.participationType === 'Team'}
                onChange={handleChange}
              />{' '}
              Team
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Additional Details:</label>
          <textarea
            name="additionalDetails"
            rows="4"
            value={formData.additionalDetails}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-submit">
            Register
          </button>
          <button type="button" className="btn-clear" onClick={handleClear}>
            Clear Form
          </button>
        </div>
      </form>

      {submittedData && (
        <div className="success-box">
          <h3 className="success-title">Registration Successful!</h3>
          <p className="success-detail">
            <strong>name:</strong> {submittedData.studentName}
          </p>
          <p className="success-detail">
            <strong>register number:</strong> {submittedData.registerNumber}
          </p>
          <p className="success-detail">
            <strong>department:</strong> {submittedData.department}
          </p>
          <p className="success-detail">
            <strong>email:</strong> {submittedData.email}
          </p>
          <p className="success-detail">
            <strong>phone:</strong> {submittedData.phone}
          </p>
          <p className="success-detail">
            <strong>event:</strong> {submittedData.event}
          </p>
          <p className="success-detail">
            <strong>event date:</strong> {submittedData.eventDate}
          </p>
          <p className="success-detail">
            <strong>participation:</strong> {submittedData.participationType}
          </p>
          <p className="success-detail">
            <strong>details:</strong> {submittedData.additionalDetails || 'None'}
          </p>
        </div>
      )}
    </div>
  );
}