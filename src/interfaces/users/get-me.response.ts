export interface GetMeResponse {
  id: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
