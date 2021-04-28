export interface AuthService {
  getCurrentUser(): Promise<{ id: string } | null>;
}
