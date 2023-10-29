import dotenv from "dotenv";
dotenv.config();

const { PORT } = process.env;

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const SALT_ROUNDS = 10;

export default { PORT, MONGODB_URI, SALT_ROUNDS };
