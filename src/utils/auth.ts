import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;

export const generateToken = (payload: {
  userId: string;
  userType: string;
}) => {
  return jwt.sign(payload, secretKey!, { expiresIn: "1h" });
};

export function generateRandomPassword() {
  return Math.random().toString(36).slice(-8);
}
