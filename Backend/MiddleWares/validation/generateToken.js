import jwt from "jsonwebtoken";

function generateToken(payload) {
  let privateKey = process.env.JWT_SECRET;
  const token = jwt.sign(payload, privateKey, { expiresIn: "7d" });
  return token;
}

export default generateToken;
