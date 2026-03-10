const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {

    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;   // { id, email }

    next();

  } catch (error) {
    console.error("AUTH ERROR 👉", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};