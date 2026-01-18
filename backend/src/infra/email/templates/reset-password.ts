export function resetPasswordTemplate(name: unknown, link: unknown) {
  return `
    <h3>Hi ${name},</h3>
    <h2>Reset your password</h2>
    <p>Click below:</p>
    <a href="${link}">${link}</a>
    <p>This link expires in 15 minutes.</p>
  `;
}

export const RESET_PASSWORD = `RESET_PASSWORD`;
