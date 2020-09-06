const mongoose = require('mongoose');

const wordSchema = require('./word');

const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  title: { type: String, required: true },
  difficulty: Number,
  created: { type: Date, default: Date.now },
  vocab: [wordSchema],
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
