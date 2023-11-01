import { Administrator } from "../../../domain/entities/admin";
export interface AdminRepository {
  // post create admin
  // get admin by id by params
  // get list admins
  // put update admin
  // delete admin

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
