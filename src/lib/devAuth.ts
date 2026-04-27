/** True when running `next dev` — dev-only auth helpers must not run in prod or test. */
export function isDevelopmentRuntime(): boolean {
  return process.env.NODE_ENV === "development";
}

export const devSessionCookieName = "next-auth.session-token";
