import { Class } from "../entities/class";

export interface ClassUseCases {
  // post create class
  // get class by id by params
  // get list classes
  // put update class
  // delete class

  create(name: string, professorId: string): Promise<void>;
  getById(id: string): Promise<Class>;
  listClasses(data: { id?: string; role?: string }): Promise<Class[]>;
  updateClass(id: string, classs: any): Promise<void>;
  deleteClass(id: string): Promise<void>;
}
