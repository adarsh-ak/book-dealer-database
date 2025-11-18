export const admin = (req, res, next) => {
  // req.user was set by authMiddleware
  if (req.user && req.user.isAdmin) {
    next(); // User is admin, continue
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied - Admin only'
    });
  }
};
