import Image from "next/image";
import { House, MailCheck } from "lucide-react";
import Link from "next/link";
import { PasswordResetForm } from "@/components/ui/custom/password-reset-form";

interface PasswordResetViewProps {
  passwordResetLoading: boolean;
  errorMessage: string | null;
  onSubmit: (email: string) => void;
  emailSent: boolean;
}

/*
  View layout for the password reset page view:
  Link: provides the functionality to navigate back to the home page via a house icon
  PasswordResetForm: renders the form that takes the email the link should be sent to.
  Image: displays an image that covers the right side of the screen for larger screen sizes
*/
export function PasswordResetView({
  passwordResetLoading,
  errorMessage,
  onSubmit,
  emailSent,
}: PasswordResetViewProps) {
  return (
    <div className="grid h-full min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center bg-slate-100 text-black">
        <Link href="/">
          <House size={30} className="flex absolute top-5 left-5" />
        </Link>
        <div>
          {emailSent ? (
            <span className="flex flex-col justify-center items-center bg-slate-100 text-xl">
              <MailCheck size={60} />
              If there is an account with the email provided, a link has been
              sent!
            </span>
          ) : (
            <PasswordResetForm
              loading={passwordResetLoading}
              errorMessage={errorMessage}
              onSubmit={onSubmit}
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
