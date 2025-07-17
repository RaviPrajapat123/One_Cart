import jwt from 'jsonwebtoken';

// tokenType = "user" | "admin"
export function authenticateToken(tokenType = "user") {
  return function (request, reply, done) {
    try {
      const cookieName = tokenType === "admin" ? "token_admin" : "token_user"; // 👈 use correct cookie
      const token = request.cookies?.[cookieName];

      if (!token) {
        return reply.status(401).send({ message: 'Authentication token required' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "oneCart123");
      request.user = decoded; // save user info for next handler
      done();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return reply.status(403).send({ message: 'Token expired. Please sign in again' });
      }
      return reply.status(401).send({ message: 'Invalid token' });
    }
  };
}
