const router = require('express').Router();
const hepburn = require('hepburn');

const { check, validationResult } = require('express-validator');

//
// ─── ADD ALL NEEDED SCHEMAS AND MODELS ──────────────────────────────────────────
//

const Lesson = require('../models/lesson');
const { ObjectId } = require('mongoose').Types;

//
// ─── GET ALL VOCAB FROM GIVEN LESSON ────────────────────────────────────────────
//

router.get('/:lesson', async (req, res) => {
  await Lesson.findOne({ title: req.params.lesson }, (err, lesson) => {
    if (!lesson) {
      res.status(400).json({
        success: false,
        msg: "This lesson doesn't exist. 😞",
      });
    } else if (err) {
      res.status(500).json({
        success: false,
        msg: 'We are royally f*cked.',
      });
    } else {
      res.status(200).json({
        success: true,
        vocab: lesson.vocab,
      });
    }
  });
});

//
// ─── ADDED CREATE ROUTE FOR WORDS IN A LESSON ───────────────────────────────────
//

router.post(
  '/:lesson',
  [
    check('japanese').notEmpty().isString(),
    check('english').notEmpty().isString(),
    check('katakana').isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    } else {
      const japanese = req.body.japanese;
      const english = req.body.english;
      let hiragana, katakana, romaji;
      if (hepburn.containsKana(japanese)) {
        romaji = hepburn.fromKana(japanese);
        if (hepburn.containsHiragana(japanese)) {
          hiragana = japanese;
        } else {
          katakana = japanese;
        }
      } else {
        romaji = japanese;
        if (req.body.katakana == true) {
          katakana = hepburn.toKatakana(japanese);
        } else {
          hiragana = hepburn.toHiragana(japanese);
        }
      }

      await Lesson.findOne({ title: req.params.lesson }, (err, lesson) => {
        // Check for error.
        if (!lesson) {
          res.status(400).json({
            success: false,
            msg: 'No a valid lesson.',
          });
        } else if (err) {
          res.status(500).json({
            success: false,
            message: "Something went wrong, maybe it's 🔥 somewhere.",
          });
        }

        // Creating the new Subdocument
        const newWord = {
          isKatakana: req.body.katakana,
          hiragana,
          katakana,
          romaji,
          english,
          lesson: lesson._id,
        };

        // Push to the Subdoc Array => vocab
        lesson.vocab.push(newWord);

        // Saving and sending response.
        lesson.save((err, lesson) => {
          if (err) {
            res.status(500).json({
              success: false,
              message: "Something went wrong, maybe it's 🔥 somewhere.",
            });
          } else {
            res.status(200).json({
              success: true,
              msg: 'That worked quite well 👍',
              lesson,
            });
          }
        });
      });
    }
  },
);

router.put('/:lesson', async (req, res) => {});

module.exports = router;
