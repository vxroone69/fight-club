import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for authentication endpoints
 * Max 10 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many attempts, please try again in 15 minutes' },
  standardHeaders: false, // Disable sending rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Rate limiter for API endpoints
 * Max 200 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { message: 'Too many requests, slow down' },
  standardHeaders: false,
  legacyHeaders: false,
});
