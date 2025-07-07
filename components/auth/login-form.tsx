"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CardWrapper } from "./card-wrapper";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { loginFields } from "@/lib/constants/auth-form";
import { GoogleLoginBtn } from "./google-login-btn";
import { FormErrorMsg } from "./form-error";
import { FormSuccessMsg } from "./form-success";
import { login } from "@/actions/auth-actions";

export const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { pending } = useFormStatus();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await login(data);
    if (res.error) {
      setError(res.error);
      setLoading(false);
    }
    if (res.success) {
      setSuccess(res.success);
      setLoading(false);
      form.reset();
    }
  };

  return (
    <CardWrapper
      label="Log in to your account"
      title="Login"
      backButtonHref="/register"
      backButtonLabel="Don't have an account? Register"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {loginFields.map(({ name, label, type, placeholder }) => (
              <FormField
                key={name}
                name={name}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input {...field} type={type} placeholder={placeholder} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormErrorMsg message={error} />
          <FormSuccessMsg message={success} />

          <Button type="submit" className="w-full cursor-pointer disabled:opacity-60" disabled={pending || loading}>
            <span className="flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Login
            </span>
          </Button>
        </form>
      </Form>
      <GoogleLoginBtn disabled={loading || pending} />
    </CardWrapper>
  );
};
