// @ts-nocheck

export const MEMBER_COOKIE = 'vm_member'

export function hasActiveMembership(cookieStore: any) {
  const value = cookieStore?.get?.(MEMBER_COOKIE)?.value
  return value === 'active'
}

export function membershipCookieOptions(days = 30) {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * days,
  }
}

