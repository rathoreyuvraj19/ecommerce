export async function isValidPassword(
  password: string,
  hashedPassword: string
) {
  const hash = await hashPassword(password);
  console.log(hash, password);
  return hash === hashedPassword;
}
async function hashPassword(password: string) {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );

  return Buffer.from(arrayBuffer).toString("base64");
}
