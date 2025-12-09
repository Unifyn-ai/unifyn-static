import { API_BASE_URL } from '../app/config';

type Json = Record<string, unknown>;

interface BrokerResponse<T = any> {
  s: 'ok' | 'error';
  d: T;
}

async function fetchJson<T = any>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include', // Include cookies for authentication
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
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
      (data?.d?.message || data?.message || data?.error) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }
  
  // Handle envelope response format
  if (data && data.s === 'ok') {
    return data.d as T;
  } else if (data && data.s === 'error') {
    throw new Error(data.d?.message || 'Request failed');
  }
  
  return data as T;
}

async function postJson<T = any>(
  path: string,
  body?: Json,
  init?: RequestInit
): Promise<T> {
  return fetchJson<T>(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  });
}

// ========== Broker Types ==========
export interface Broker {
  code: string;
  name: string;
  accountOpenUrl?: string;
  [key: string]: any;
}

export interface BrokerAccount {
  id: string;
  userId: string;
  brokerCode: string;
  brokerDetails: {
    clientcode?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BrokerTokens {
  accountId: string;
  brokerCode: string;
  accessToken: string;
  refreshToken?: string;
  feedToken?: string;
  expiresAt?: string;
}

export interface CreateBrokerAccountPayload {
  brokerCode: string;
  clientcode: string;
  mpin: string;
  totp_key: string;
  api_key: string;
  [key: string]: any;
}

// ========== API Functions ==========

/**
 * Get list of supported brokers
 */
export async function getBrokers(): Promise<Broker[]> {
  const data = await fetchJson<{ brokers: Broker[] }>('/brokers');
  return data.brokers || [];
}

/**
 * Get all broker accounts for the authenticated user
 */
export async function getBrokerAccounts(): Promise<BrokerAccount[]> {
  const data = await fetchJson<{ accounts: BrokerAccount[] }>('/brokers/accounts');
  return data.accounts || [];
}

/**
 * Create a new broker account
 */
export async function createBrokerAccount(
  payload: CreateBrokerAccountPayload
): Promise<BrokerAccount> {
  const data = await postJson<{ account: BrokerAccount }>('/brokers/accounts', payload);
  return data.account;
}

/**
 * Get a single broker account by ID
 */
export async function getBrokerAccount(accountId: string): Promise<BrokerAccount> {
  return fetchJson<BrokerAccount>(`/brokers/accounts/${accountId}`);
}

/**
 * Get tokens for a broker account
 */
export async function getBrokerTokens(accountId: string): Promise<BrokerTokens> {
  return postJson<BrokerTokens>(`/brokers/accounts/${accountId}/tokens`);
}

