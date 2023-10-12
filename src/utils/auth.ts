import jwt from "jsonwebtoken";

const secretKey =
  "a832f6d4626e4e2c8cfe299d85d3a5b74eb1f68c5d6b2e9b527083d59ecb49f7";

export const generateToken = (payload: {
  userId: string;
  userType: string;
}) => {
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};
