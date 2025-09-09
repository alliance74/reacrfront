import { API_URL } from '@/config';
import { getAuthToken } from './auth.service';

export interface ReferralItem {
  email: string;
  date: string; // ISO
  status: string;
}

export interface ReferralStats {
  referralCode: string;
  referralCount: number;
  creditsEarned?: number;
  referralEarnings?: number;
  recentReferrals: ReferralItem[];
}

export const getReferralStats = async (): Promise<ReferralStats> => {
  const token = await getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_URL}/referrals/stats`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to load referral stats');
  }

  return res.json();
};
