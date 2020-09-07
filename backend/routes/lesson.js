const router = require('express').Router();
const { check, validationResult } = require('express-validator');

//
// ─── BRING IN THE SCHEMAS ──────────────────────────────────────────────────────
//

const Lesson = require('../models/lesson');
const wordSchema = require('../models/word');

// ────────────────────────────────────────────────────────────────────────────────

//
// ─── GET ALL LESSONS ────────────────────────────────────────────────────────────
//

router.get('/', async (_, res) => {
  await Lesson.find({}, (err, lessons) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Something didn't go well. Try again later.",
      });
    } else {
      res.status(200).json({
        success: true,
        data: lessons,
      });
    }
  });
});

//
// ─── GET THE LESSON WITH GIVEN TITLE ────────────────────────────────────────────
//

router.get('/:title', async (req, res) => {
  await Lesson.findOne({ title: req.params.title }, (err, lesson) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong, maybe it's 🔥 somewhere.",
      });
    }
    if (!lesson) {
      res.status(400).json({
        success: false,
        message: "That's a non-existent lesson you got there. 😕",
      });
    } else {
      res.status(200).json({
        success: true,
        data: lesson,
      });
    }
  });
});

//
// ─── ENDPOINT FOR CREATING NEW LESSONS ────────────────────────────────
//

router.post(
  '/',
  [
    check('title')
      .notEmpty()
      .withMessage("Title can't be empty.")
      .trim()
      .escape(),
    check('difficulty').isInt(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    } else {
      // Check if title already exists
      await Lesson.findOne({ title: req.body.title }, (err, lesson) => {
        // Typical Error handling
        if (err) {
          res.status(500).send('Something is wrong...');
        }
        // If we get a result --> We already have that title
        else if (lesson) {
          res.status(400).json({
            success: false,
            msg: 'This name has already been taken.',
          });
        }
        // Go on with saving the Object :)
        else {
          const lesson = new Lesson({
            title: req.body.title,
            difficulty: req.body.difficulty,
          });
          lesson.save((err, product) => {
            if (err) {
              res.status(500).json({ success: false, errors: err });
            } else {
              res.status(200).json({
                success: true,
                msg: 'Created new lesson 🍾',
                lesson: product,
              });
            }
          });
        }
      });
    }
  },
);

//
// ─── UPDATE LESSON ──────────────────────────────────────────────────────────────
//

router.put('/:title', async (req, res) => {
  await Lesson.updateOne(
    { title: req.params.title },
    { title: req.body.title, difficulty: req.body.difficulty },
    (err, raw) => {
      if (err) {
        res.status(500).send("That's no good 😞");
      } else if (raw.nModified == 0) {
        res.status(400).json({
          success: false,
          msg: 'Non-existent lesson. ',
        });
      } else {
        res.status(200).json({
          success: true,
          msg: 'Updated Document 🔧',
        });
      }
    },
  );
});

// ────────────────────────────────────────────────────────────────────────────────

module.exports = router;
