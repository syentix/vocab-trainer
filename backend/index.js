const express = require('express');
const mongoose = require('mongoose');

const app = express();

//
// ─── ADDING USEFUL MIDDLEWARE ───────────────────────────────────────────────────
//

require('dotenv').config();
var bodyParser = require('body-parser');
bodyParser.urlencoded({
  extended: true,
});

// ────────────────────────────────────────────────────────────────────────────────

// Connecting to the Database
mongoose.connect(process.env.MONGO_DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/api/v1/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Japanese Vocab Trainer API.',
  });
});

//
// ─── ADDING THE NEW ROUTES ──────────────────────────────────────────────────────
//

const lessonRoutes = require('./routes/lesson');
const wordRoutes = require('./routes/word');

app.use('/api/v1/lesson', lessonRoutes);
app.use('/api/v1/word', wordRoutes);

// ────────────────────────────────────────────────────────────────────────────────

// Listening to given port or default to 3333
const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log('Backend living on http://localhost:' + port);
});
