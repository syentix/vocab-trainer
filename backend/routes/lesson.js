const router = require('express').Router();
const { body, validationResult } = require('express-validator');

//
// ─── BRING IN THE SCHEMAS ──────────────────────────────────────────────────────
//

const Lesson = require('../models/lesson');

// ────────────────────────────────────────────────────────────────────────────────

router.get('/', (_, res) => {
  Lesson.find({}, (err, lessons) => {
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

router.get('/:title', (req, res) => {
  Lesson.findOne({ title: req.params.title }, (err, lesson) => {
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

router.post('/', (req, res) => {});

module.exports = router;
