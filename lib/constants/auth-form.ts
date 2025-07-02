import { RegisterFieldConfig, LoginFieldConfig } from "@/types/auth-form-types";

export const registerFields: RegisterFieldConfig[] = [
  { name: "username", label: "Name", type: "text", placeholder: "John Doe", },
  { name: "email", label: "Email", type: "text", placeholder: "johndoe@gmail.com" },
  { name: "password", label: "Password", type: "password", placeholder: "******" },
  { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "******" },
];

export const loginFields: LoginFieldConfig[] = [
  { name: "email", label: "Email", type: "text", placeholder: "johndoe@gmail.com" },
  { name: "password", label: "Password", type: "text", placeholder: "******" },
];
