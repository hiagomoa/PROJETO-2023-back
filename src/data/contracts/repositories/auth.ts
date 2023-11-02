import { AdminContract, StudentContract, TeacherContract } from "../entities";

export interface AuthRepository {
  SignIn(
    email: string,
    password: string
  ): Promise<StudentContract | TeacherContract | AdminContract>;
  Refresh(
    userId: string
  ): Promise<StudentContract | TeacherContract | AdminContract>;
  ForgotPassword(email: string): Promise<ForgotPasswordContract | undefined>;

  ChangePassword(data: {
    lastPassword: string;
    newPassword: string;
    confirmationPassword: string;
    userID: string;
  }): Promise<void>;
}

export type JWTResult = {
  user: StudentContract | TeacherContract | AdminContract;
  token: string;
};

export type ForgotPasswordContract = {
  email: string;
  userName: string;
  password: string;
};
