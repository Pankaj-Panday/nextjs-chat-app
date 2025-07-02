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

export const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
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

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    console.log("data", data);
    // Send data to backend
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

          <Button type="submit" className="w-full cursor-pointer disabled:opacity-60" disabled={pending || loading}>
            <span className="flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Register
            </span>
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
