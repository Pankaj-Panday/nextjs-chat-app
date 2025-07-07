"use client";

import { useActionState, useEffect } from "react";
import { Button } from "../ui/button";
import { logout } from "@/actions/auth-actions";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const LogoutButton = () => {
  const [success, logoutAction, pending] = useActionState(logout, undefined);

  useEffect(() => {
    if (success) {
      // show sucess toast
      toast.success("Success", {
        description: "Logged out successfully",
      });
    } else {
      // show error toast
      toast.error("Error", {
        description: "Problem logging out",
      });
    }
  }, [success]);

  return (
    <>
      <form action={logoutAction}>
        <Button type="submit" variant="default" className="w-30">
          {pending ? <Loader2 className={cn("h-4 w-4", pending && "animate-spin")} /> : null}
          <span>{pending ? "Loading..." : "Logout"}</span>
        </Button>
      </form>
    </>
  );
};
