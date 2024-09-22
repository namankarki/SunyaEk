const checkRole = (role) => {
  return (req, res, next) => {
    const userRole = req.body.role; // Normally, you’d fetch the role from the user’s session or JWT token
    if (userRole !== role) {
      return res
        .status(403)
        .json({ message: "Access forbidden: Insufficient privileges" });
    }
    next();
  };
};
