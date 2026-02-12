import Image from "next/image";
import { House, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { UpdatePasswordForm } from "@/components/ui/custom/update-password-form";

interface UpdatePasswordViewProps {
  updatePasswordLoading: boolean;
  passwordShown: boolean;
  passwordUpdated: boolean;
  onEyeClick: () => void;
  onSubmit: (
    password: string,
    accessToken: string,
    refreshToken: string,
  ) => void;
}

/*
  View layout for the password reset page view:
  Link: provides the functionality to navigate back to the home page via a house icon
  PasswordResetForm: renders the form that takes the email the link should be sent to.
  Image: displays an image that covers the right side of the screen for larger screen sizes
*/
export function UpdatePasswordView({
  updatePasswordLoading,
  passwordShown,
  onEyeClick,
  onSubmit,
  passwordUpdated,
}: UpdatePasswordViewProps) {
  return (
    <div className="grid h-full min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center bg-slate-100 text-black">
        <div>
          {passwordUpdated ? (
            <span className="flex flex-col justify-center items-center bg-slate-100 text-xl">
              <BadgeCheck size={60} />
              Password changed successfully!
            </span>
          ) : (
            <UpdatePasswordForm
              loading={updatePasswordLoading}
              passwordShown={passwordShown}
              onSubmit={onSubmit}
              onEyeClick={onEyeClick}
            />
          )}
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image
          src="/amuse1.jpg"
          alt="Amusement park"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
