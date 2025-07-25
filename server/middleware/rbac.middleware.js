function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.userId || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
}

module.exports = authorizeRoles;