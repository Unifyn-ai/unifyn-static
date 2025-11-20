import { API_BASE_URL } from '../app/config';

type Json = Record<string, unknown>;

async function postJson<T = any>(
  path: string,
  body?: Json,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include', // Include cookies for authentication
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  });
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // ignore parse error; surface below if !ok
  }
  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

// ========== Mobile OTP ==========
export function initMobileAuth(mobile: string, purpose: 'login' | string = 'login') {
  return postJson('/auth/mobile/init', { mobile, purpose });
}

export function resendMobileOtp(mobile: string, purpose: 'login' | string = 'login') {
  return postJson('/auth/mobile/resend', { mobile, purpose });
}

export function verifyMobileOtp(
  mobile: string,
  otp: string,
  purpose: 'login' | string = 'login'
) {
  return postJson('/auth/mobile/verify', { mobile, otp, purpose });
}

// ========== Email OTP ==========
export function initEmailAuth(email: string, purpose: 'login' | string = 'login') {
  return postJson('/auth/email/init', { email, purpose });
}

export function resendEmailOtp(email: string, purpose: 'login' | string = 'login') {
  return postJson('/auth/email/resend', { email, purpose });
}

export function verifyEmailOtp(
  email: string,
  otp: string,
  purpose: 'login' | string = 'login'
) {
  return postJson('/auth/email/verify', { email, otp, purpose });
}

// ========== Social Auth ==========
export function authWithGoogle(idToken: string, mobile?: string) {
  const body: Json = { token: idToken };
  if (mobile) body.mobile = mobile;
  return postJson('/auth/google', body);
}

export function authWithApple(idToken: string, mobile?: string) {
  const body: Json = { token: idToken };
  if (mobile) body.mobile = mobile;
  return postJson('/auth/apple', body);
}



