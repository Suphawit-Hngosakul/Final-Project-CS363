const requireOwnership = (req, res, next) => {
  if (req.params.id !== req.user.restaurantId?.toString()) {
    return res.status(403).json({ message: 'Forbidden: this resource does not belong to your restaurant' })
  }
  next()
}

export default requireOwnership
