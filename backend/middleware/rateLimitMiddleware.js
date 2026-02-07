const { client } = require('../config/redis');

/**
 
 * @param {number} limit - Max number of requests
 * @param {number} duration - Time window in seconds
 * @returns {function} Express middleware
 */
const rateLimit = (limit, duration) => async (req, res, next) => {
  // 1. Fail Open: If Redis is not connected, skip rate limiting
  if (!client || !client.isOpen) {
    return next();
  }

  try {
    // 2. Identify the client: Use User ID if authenticated, otherwise IP
    const identifier = req.user ? req.user._id : req.ip;
    const key = `rate_limit:${identifier}:${req.originalUrl}`;


    const [requestCount] = await client
      .multi()
      .incr(key)
      .expire(key, duration, 'NX') 
      .exec();

    // 4. Check limit
    if (requestCount > limit) {
        // Get time to live to tell user when they can try again
        const ttl = await client.ttl(key);
        
        return res.status(429).json({
          error: 'Too many requests',
          message: `Too many requests, please try again in ${ttl} seconds.`,
          retryAfter: ttl
        });
    }

    next();
  } catch (error) {
    console.error('Rate Limit Error:', error.message);
    // 5. Fail Open on error
    next();
  }
};

module.exports = rateLimit;
