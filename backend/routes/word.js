const router = require('express').Router();
const hepburn = require('hepburn');

const { check, validationResult } = require('express-validator');

//
// ─── ADD ALL NEEDED SCHEMAS AND MODELS ──────────────────────────────────────────
//

const Lesson = require('../models/lesson');
const wordSchema = require('../models/word');

//
// ─── GET ALL VOCAB FROM GIVEN LESSON ────────────────────────────────────────────
//

router.get('/:lesson', async (req, res) => {
  await Lesson.find({ title: req.params.lesson }, (err, lesson) => {
    if (err) {
      res.status(400).json({
        success: false,
        msg: "This lesson doesn't exist. 😞",
      });
    } else {
      res.status(200).json({
        success: true,
        vocab: lesson.vocab,
      });
    }
  });
});

router.post(
  '/:lesson',
  [
    check('romaji').notEmpty().isString(),
    check('english').notEmpty().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    } else {
      const romaji = req.body.romaji;
      const english = req.body.english;
      const hiragana = hepburn.toHiragana(romaji);
      if (req.body.katakana == true) {
        const katakana = hepburn.toKatakana;
      }
    }
  },
);

module.exports = router;
