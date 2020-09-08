const router = require('express').Router();
const hepburn = require('hepburn');

const { check, validationResult } = require('express-validator');

const { resErrorMongo, resNoLessonFound } = require('./lib/responses');

//
// ─── ADD ALL NEEDED SCHEMAS AND MODELS ──────────────────────────────────────────
//

const Lesson = require('../models/lesson');
const { ObjectId } = require('mongoose').Types;

const checkErrors = (err, lesson, res) => {
  if (!lesson) resNoLessonFound(res);
  if (err) resErrorMongo(res);
  return;
};

//
// ─── GET ALL VOCAB FROM GIVEN LESSON ────────────────────────────────────────────
//

router.get('/:lesson', async (req, res) => {
  await Lesson.findOne({ title: req.params.lesson }, (err, lesson) => {
    if (!lesson) {
      resNoLessonFound(res);
    } else if (err) {
      resErrorMongo(res);
    } else {
      res.status(200).json({
        success: true,
        vocab: lesson.vocab,
      });
    }
  });
});

//
// ─── CREATE ROUTE FOR WORDS IN A LESSON ───────────────────────────────────
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

      // Declare our variables, that will be filled in.
      let hiragana, katakana, romaji;

      // Check if our japanese input is Kana
      // yes => convert to romaji fill in hiragana OR katakana
      if (hepburn.containsKana(japanese)) {
        romaji = hepburn.fromKana(japanese);
        if (hepburn.containsHiragana(japanese)) {
          hiragana = japanese;
        } else {
          katakana = japanese;
        }
      }

      // no => japanese is romaji convert to hiragana or katakana (if selected)
      else {
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
          resNoLessonFound(res);
        } else if (err) {
          resErrorMongo(res);
        } else {
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
              resErrorMongo(res);
            } else {
              res.status(200).json({
                success: true,
                msg: 'That worked quite well 👍',
                payload: newWord,
              });
            }
          });
        }
      });
    }
  },
);

//
// ─── UPDATE A WORD IN A LESSON ──────────────────────────────────────────────
//

router.put('/:lesson', async (req, res) => {
  await Lesson.findOne({ title: req.params.lesson }, (err, lesson) => {
    if (!lesson) resNoLessonFound(res);
    else if (err) resErrorMongo(res);
    else {
      // Getting the subdocument from the given _id
      let word = lesson.vocab.id(ObjectId(req.body._id));

      // Updating the values
      word.set(req.body.data);

      // Saving and responding.
      lesson.save((err, word) => {
        if (err) resErrorMongo(res);
        else {
          res.status(200).json({
            success: true,
            msg: 'Word has been updated :)',
            word,
          });
        }
      });
    }
  });
});

//
// ─── DELETE A WORD IN A LESSON ──────────────────────────────────────────────────
//

router.delete('/:lesson', (req, res) => {
  Lesson.findOne({ title: req.params.lesson }, (err, lesson) => {
    checkErrors(err, lesson, res);
    const word = lesson.vocab.id(ObjectId(req.body._id)).remove();
    lesson.save((err, lesson) => {
      checkErrors(err, lesson, res);
      if (!word) {
        res.status(400).json({
          success: false,
          msg: 'No word found 🔍',
        });
      } else {
        res.status(200).json({
          success: true,
          msg: 'Word has been successfully deleted.',
          removed: word,
        });
      }
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────────

module.exports = router;
