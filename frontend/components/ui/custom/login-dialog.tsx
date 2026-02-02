import { PropsWithChildren } from "react";
import { Spinner } from "@/components/ui/spinner";
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

interface LoginDialogProps extends React.PropsWithChildren {
  loginLoading: boolean;
  errorMessage: string | null;
  passwordShown: boolean;
  dialogIsOpen: boolean;
  onEyeClick: () => void;
  onLoginClick: (username: string, password: string) => void;
  onOpenChange: (value: boolean) => void;
}

export function LoginDialog({
  children,
  loginLoading,
  errorMessage,
  passwordShown,
  dialogIsOpen,
  onEyeClick,
  onLoginClick,
  onOpenChange,
}: LoginDialogProps) {
  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    onLoginClick(username, password);
  }
  return (
    <Dialog open={dialogIsOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleFormSubmit} role="form">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              In order to create or review applications, please login.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-5">
            <div className="grid gap-3">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter username..."
                  className="peer user-invalid:border-red-500"
                  required
                />
                <p className="text-sm text-red-500 hidden peer-user-invalid:block">
                  Required
                </p>
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={passwordShown ? "text" : "password"}
                  placeholder="••••••••••"
                  className="peer user-invalid:border-red-500"
                  required
                />
                <button
                  type="button"
                  aria-label={passwordShown ? "hide password" : "show password"}
                  className="absolute w-5 top-2 right-2"
                  onClick={onEyeClick}
                >
                  {passwordShown ? (
                    <EyeOff size={20} className="text-muted-foreground" />
                  ) : (
                    <Eye size={20} className="text-muted-foreground" />
                  )}
                </button>
                <p className="text-sm text-red-500 hidden peer-user-invalid:block">
                  Required
                </p>
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
              <Button variant="outline" disabled={loginLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loginLoading}>
              {loginLoading ? <Spinner className="size-4" /> : "Login"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
