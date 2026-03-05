// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from "jsonwebtoken";

const createToken = (payload) =>
  jwt.sign(
    {
      userId: payload,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

export default createToken;
