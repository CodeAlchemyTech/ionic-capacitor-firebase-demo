export interface UserDetail {
  uid: string;
  email?: string;
  providerId: string;
  displayName: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  phoneNumber: string | null;
  photoUrl: string | null;
  tenantId: string | null;
}
