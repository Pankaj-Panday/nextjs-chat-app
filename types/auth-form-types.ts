import { RegisterSchema, LoginSchema } from "@/schemas/auth-schemas";
import { z } from "zod";

type RegisterFormFields = keyof z.infer<typeof RegisterSchema>;
type LoginFormFields = keyof z.infer<typeof LoginSchema>;

type BaseFieldConfig = {
  label: string;
  type: string;
  placeholder?: string;
};

export type RegisterFieldConfig = {
  name: RegisterFormFields;
} & BaseFieldConfig;

export type LoginFieldConfig = {
  name: LoginFormFields;
} & BaseFieldConfig;
