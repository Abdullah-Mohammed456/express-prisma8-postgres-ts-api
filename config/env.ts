import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || Buffer.byteLength(jwtSecret, "utf8") < 32) {
  throw new Error(
    "JWT_SECRET must be set to a random value of at least 32 bytes.",
  );
}

export const JWT_SECRET = jwtSecret;
