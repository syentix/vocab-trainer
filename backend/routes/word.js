const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Get all words.',
  });
});

module.exports = router;
