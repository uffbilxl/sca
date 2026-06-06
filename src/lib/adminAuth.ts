// Edge-compatible auth helper (Web Crypto only — no Node.js crypto)
export const ADMIN_COOKIE = 'sca_admin'

export async function getSessionToken(): Promise<string> {
  const secret = process.env.NEXTAUTH_SECRET ?? 'fallback'
  const password = process.env.ADMIN_PASSWORD ?? 'changeme'
  const data = new TextEncoder().encode(`sca_admin_v1:${secret}:${password}`)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifySessionCookie(value: string): Promise<boolean> {
  return value === (await getSessionToken())
}
