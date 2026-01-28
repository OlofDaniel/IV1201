import { PropsWithChildren } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PopupDialogProps extends React.PropsWithChildren {
  username: string | null;
  password: string | null;
  passwordShown: boolean;
  dialogIsOpen: boolean;
  onEyeClick: () => void;
  onLoginClick: React.FormEventHandler<HTMLFormElement>;
  onOpenChange: (value: boolean) => void;
}

export function LoginDialog({
  children,
  username,
  password,
  passwordShown,
  dialogIsOpen,
  onEyeClick,
  onLoginClick,
  onOpenChange,
}: PopupDialogProps) {
  return (
    <Dialog open={dialogIsOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onLoginClick}>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              In order to create or review applications, please login.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-5">
            <div className="grid gap-3">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter username..."
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={passwordShown ? "text" : "password"}
                  placeholder="••••••••••"
                  className=""
                />
                <button
                  className="absolute w-5 top-2 right-2"
                  onClick={onEyeClick}
                >
                  {passwordShown ? (
                    <EyeOff size={20} className="text-muted-foreground" />
                  ) : (
                    <Eye size={20} className="text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="text-sm leading-none font-medium mt-5 text-muted-foreground">
            Don't have an account?
            <Link href="/signup" className="text-blue-700">
              {" "}
              Sign up here
            </Link>
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Login</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
