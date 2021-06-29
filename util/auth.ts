export function generateCsrfSecretByToken(token: string) {
  return token + process.env.CSRF_SECRET_SALT;
}
