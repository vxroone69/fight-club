/**
 * Zod validation middleware factory
 * Returns Express middleware that validates req.body against a Zod schema
 */
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error.errors && error.errors.length > 0) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(400).json({ message: 'Validation failed' });
    }
  };
};
