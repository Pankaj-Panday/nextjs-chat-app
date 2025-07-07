"use server";

import { signIn, signOut } from "@/auth";
import { LoginSchema, RegisterSchema } from "@/schemas/auth-schemas";
import { AuthError } from "next-auth";
import { z } from "zod";
import { hashPassword } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { AuthActionResponse } from "@/types/auth-types";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function loginWithGoogle() {
  try {
    await signIn("google", { redirectTo: "/chat" });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Google Log in failed";
    }
    throw error;
  }
}

export async function register(data: z.infer<typeof RegisterSchema>): Promise<AuthActionResponse> {
  try {
    // Validate the data
    const validatedData = RegisterSchema.parse(data);

    const { username, email, password, confirmPassword } = validatedData;
    if (password !== confirmPassword) {
      return { error: "Password donot match" };
    }

    // hash password
    const hashedPassowrd = await hashPassword(password);

    // check if use already exist on database
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return { error: "Email already registered" };
    }

    // create the user
    await prisma.user.create({
      data: {
        name: username,
        email: email.toLowerCase(),
        password: hashedPassowrd,
      },
    });

    return { success: "Registration successful" };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input data" };
    }
    return { error: "Registration failed" };
  }
}

export async function login(data: z.infer<typeof LoginSchema>): Promise<AuthActionResponse> {
  try {
    const { email, password } = data;

    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      // redirect: false,
      redirectTo: "/chat",
    });

    return { success: "Login successful" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        case "CallbackRouteError":
          return { error: error.cause?.err?.toString() ?? "Authentication failed" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}

export async function logout() {
  try {
    await signOut({ redirectTo: "/login" });
    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return { success: false };
  }
}
