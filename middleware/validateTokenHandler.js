import jwt from "jsonwebtoken";

const validateToken = async (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Attach decoded user data to the request object
      req.user = decoded;

      // Proceed to the next middleware or route handler
      next();
    } catch (err) {
      // Handle invalid token
      return res
        .status(401)
        .json({ success: false, message: "User is not authorized" });
    }
  } else {
    // Handle missing token
    return res
      .status(403)
      .json({ success: false, message: "Token is required for access" });
  }
};

export default validateToken;
