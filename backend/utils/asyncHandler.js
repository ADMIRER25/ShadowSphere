const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      res.status(error.statusCode || 500).json({ message: error.message });
      next(error);
    });
  };
};

export { asyncHandler };
