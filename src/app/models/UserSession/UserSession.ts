export interface UserSession {

  id: number;

  refreshToken: string;

  location: string;

  expiresAt: string;

  loginDate: string | null;

  userAgent: string | null;

  isCurrent: boolean;
}
