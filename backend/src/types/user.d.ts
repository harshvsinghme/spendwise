export interface IUserDB {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}
