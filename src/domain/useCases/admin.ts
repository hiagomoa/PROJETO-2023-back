import { Administrator } from "../entities/admin";
export interface AdminUseCases {
  create: (
    name: string,
    email: string,
    password: string
  ) => Promise<Administrator>;
  getById: (id: string) => Promise<Administrator>;
  listAdmins: () => Promise<Administrator[]>;
  updateAdmin: (id: string, admin: Administrator) => Promise<void | string>;
  deleteAdmin: (id: string) => Promise<void | string>;
}
