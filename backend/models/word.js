const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const wordSchema = new Schema({
  created: { type: Date, default: Date.now },
  hiragana: String,
  kanji: String,
  katakana: String,
  romaji: { type: String, required: true },
  english: { type: String, required: true },
  lesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
});

module.exports = wordSchema;
