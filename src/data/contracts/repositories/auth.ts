import { AdminContract, StudentContract, TeacherContract } from "../entities";

export interface AuthRepository {
  SignIn(
    email: string,
    password: string
  ): Promise<StudentContract | TeacherContract | AdminContract>;
  Refresh(
    userId: string
  ): Promise<StudentContract | TeacherContract | AdminContract>;
}

export type JWTResult = {
  user: StudentContract | TeacherContract | AdminContract;
  token: string;
};
