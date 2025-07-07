"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { loginWithGoogle } from "@/actions/auth-actions";
import { useActionState } from "react";
import { FormErrorMsg } from "./form-error";

export const GoogleLoginBtn = ({ disabled }: { disabled: boolean }) => {
  const [errorMsgGoogle, googleLoginAction] = useActionState(loginWithGoogle, undefined);

  return (
    <form className="flex mt-4" action={googleLoginAction}>
      <Button variant={"outline"} disabled={disabled} className="w-full flex items-center gap-2 cursor-pointer">
        <Image src="icons/google.svg" alt="google" width={20} height={20} className="w-5 h-5" />
        Continue with Google
      </Button>
      <FormErrorMsg message={errorMsgGoogle || ""} />
    </form>
  );
};
