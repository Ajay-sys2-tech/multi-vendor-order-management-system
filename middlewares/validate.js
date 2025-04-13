// middleware/validate.js
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
  
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
  
      return res.status(400).json({ errors });
    }
  
    req.body = result.data; // Safe, parsed data
    next();
  };
  
  module.exports = validate;
  