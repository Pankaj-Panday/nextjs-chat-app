"use client";

import { useActionState, useEffect } from "react";
import { logout } from "@/actions/auth-actions";
import { toast } from "sonner";

export const LogoutButton = () => {
  const [success, logoutAction] = useActionState(logout, undefined);

  useEffect(() => {
    if (success) {
      // show sucess toast
      toast.success("Success", {
        description: "Logged out successfully",
      });
    } else if(success === false) {
      // show error toast
      toast.error("Error", {
        description: "Problem logging out",
      });
    }
  }, [success]);

  return (
    <>
      <form action={logoutAction}>
        <button type="submit" className="">
          <span>Logout</span>
        </button>
      </form>
    </>
  );
};
