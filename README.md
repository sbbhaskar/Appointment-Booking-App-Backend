________________________________________
Backend — README.md
# Appointment Booking API (Backend)

Node/Express + MongoDB API for a minimal Appointment Booking System.

## Features
- JWT auth (register / login)
- 30-min time slots from **09:00–17:00** (server-generated)
- Prevents double-booking with a unique Mongo index
- List my appointments, book, cancel
- Hardened with Helmet, CORS, Rate-limit, and Morgan

---

## Tech
- Node.js, Express
- MongoDB + Mongoose
- JSON Web Tokens
- Helmet, CORS, express-rate-limit

---

## Project Structure
appointment-backend/
├─ server.js
├─ package.json
├─ .env.example
├─ config/
│ └─ db.js
├─ models/
│ ├─ User.js
│ └─ Appointment.js
├─ middleware/
│ └─ auth.js
├─ routes/
│ ├─ auth.js
│ └─ appointments.js
└─ utils/
└─ slots.js

---

## Environment Variables
Create `.env` from `.env.example`:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/appointments_db
JWT_SECRET=supersecretchangeme
CLIENT_URL=http://localhost:5173

- `CLIENT_URL` can be a comma-separated list for multiple origins.

---

## Setup & Run

```bash
npm i
npm run dev      # watches server.js
# or
npm start
Server: http://localhost:5000
MongoDB must be running locally or use a cloud URI.
________________________________________
API Endpoints
Auth
•	POST /api/auth/register
o	body: { "name": "Bhaskar", "email": "me@example.com", "password": "secret" }
•	POST /api/auth/login
o	body: { "email": "me@example.com", "password": "secret" }
•	Response: { token, user: { id, name, email } }
Appointments
•	GET /api/appointments/slots?provider=Dr.%20Sharma&date=2025-08-15
o	Response: { provider, date, available: ["09:00","09:30", ...] }
•	POST /api/appointments (auth)
o	body: { "provider":"Dr. Sharma", "date":"YYYY-MM-DD", "time":"HH:mm" }
•	GET /api/appointments/my (auth)
•	DELETE /api/appointments/:id (auth)
Auth header: Authorization: Bearer <token>
________________________________________
Quick cURL Test
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}' | jq -r .token)

# Slots
curl "http://localhost:5000/api/appointments/slots?provider=Dr.%20Sharma&date=2025-08-15"

# Book (needs TOKEN)
curl -X POST http://localhost:5000/api/appointments \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"provider":"Dr. Sharma","date":"2025-08-15","time":"10:30"}'

# My appointments
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/appointments/my
________________________________________
Deployment (Render)
1.	Create a Web Service → connect repo.
2.	Runtime: Node 18+.
3.	Build command: (empty)
Start command: node server.js
4.	Add env vars: PORT, MONGO_URI, JWT_SECRET, CLIENT_URL (your Vercel URL).
5.	Deploy. Note your Render URL, e.g. https://your-api.onrender.com.
________________________________________
Notes & Extensibility
•	Slots live in utils/slots.js. Change window or step size as needed.
•	Unique index (provider+date+time) prevents double-bookings.
•	Easy to extend: add providers collection, holidays, admin approval, email/SMS, payments.
________________________________________
Troubleshooting
•	CORS blocked: ensure CLIENT_URL matches your frontend domain(s).
•	E11000 duplicate key: that slot was taken—handle gracefully on the UI.
•	Mongo not connecting: check firewall/whitelist and the MONGO_URI.
License: MIT

---
