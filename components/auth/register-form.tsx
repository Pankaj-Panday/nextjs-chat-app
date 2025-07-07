"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CardWrapper } from "./card-wrapper";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { registerFields } from "@/lib/constants/auth-form";
import { GoogleLoginBtn } from "./google-login-btn";
import { register } from "@/actions/auth-actions";
import { FormErrorMsg } from "./form-error";
import { FormSuccessMsg } from "./form-success";

export const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { pending } = useFormStatus();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    setSuccess("");
    setError("");
    
    const res = await register(data);
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
      label="Create an account"
      title="Register"
      backButtonHref="/login"
      backButtonLabel="Already have an account? Login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {registerFields.map(({ name, label, type, placeholder }) => (
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
              Register
            </span>
          </Button>
        </form>
      </Form>
      <GoogleLoginBtn disabled={loading || pending} />
    </CardWrapper>
  );
};
