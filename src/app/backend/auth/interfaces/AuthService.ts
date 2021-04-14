export interface AuthService {
  getUserDetailsByToken(token: string): Promise<{ id: string } | null>;
}
