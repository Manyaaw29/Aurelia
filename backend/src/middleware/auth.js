exports.requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/auth/signin');
  }
  next();
};

exports.redirectIfAuth = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/');
  }
  next();
};
