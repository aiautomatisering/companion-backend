export const configuration = () => {
  return {
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
    globalPrefix: process.env.GLOBAL_PREFIX,
  };
};
