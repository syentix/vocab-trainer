//
// ─── SETUP SOME STANDARD RESPONSES FOR ERRORS ───────────────────────────────────
//

const responses = {
  resNoLessonFound: (res) => {
    res.status(400).json({
      success: false,
      msg: 'No Lesson found 🔍 Try again!',
    });
  },

  resErrorMongo: (res) => {
    res.status(500).json({
      success: false,
      msg: "Something went wrong, maybe it's 🔥 somewhere.",
    });
  },
};

module.exports = responses;
