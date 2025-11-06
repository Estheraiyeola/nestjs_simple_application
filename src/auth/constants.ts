const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('Missing JWT_SECRET environment variable. Set JWT_SECRET in your environment or .env file.');
}

export const jwtConstants = {
  secret,
};
