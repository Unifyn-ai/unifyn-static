import { API_BASE_URL } from '../app/config';

// Type definitions
export interface UserDetails {
  id: string;
  mobile?: string;
  email?: string;
  name?: string;
  email_verified?: boolean;
  mobile_verified?: boolean;
  two_factor_enabled?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserDetailsResponse {
  s: 'ok' | 'error';
  d?: UserDetails;
  message?: string;
}

/**
 * Fetch user details from the API
 * Uses credentials: 'include' to send HTTP cookies
 */
export async function getUserDetails(): Promise<UserDetails | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/details`, {
      method: 'GET',
      credentials: 'include', // Important: Include cookies for authentication
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // User is not authenticated
      if (response.status === 401) {
        return null;
      }
      throw new Error(`Failed to fetch user details: ${response.status}`);
    }

    const data: UserDetailsResponse = await response.json();
    
    if (data.s === 'ok' && data.d) {
      return data.d;
    }

    return null;
  } catch (error) {
    console.error('[getUserDetails] Error:', error);
    return null;
  }
}

/**
 * Logout the current user
 */
export async function logoutUser(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('[logoutUser] Error:', error);
    return false;
  }
}

