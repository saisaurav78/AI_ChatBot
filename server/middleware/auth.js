import jwt from 'jsonwebtoken';

// Middleware to verify JWT token from cookies
export const verifyToken = (req, res, next) => {
  // Extract token from cookies
  const token = req.cookies?.token;

  // If no token found, respond with 401 Unauthorized
  if (!token) return res.sendStatus(401);

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded token payload (user info) to request object
    req.user = decoded;

    // Proceed to next middleware or route handler
    next();
  } catch (err) {
    // If token is invalid or expired, respond with 403 Forbidden and error message
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Route handler to logout user by clearing the auth token cookie
export const logout = (req, res) => {
  // Clear the 'token' cookie from the client
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  });

  // Prevent caching of the logout response
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Send success response
  res.status(200).json({ message: 'Logged out' });
};
