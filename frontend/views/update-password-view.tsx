import Image from "next/image";
import { CircleAlert } from "lucide-react";
import { UpdatePasswordForm } from "@/components/ui/custom/update-password-form";
import { Spinner } from "@/components/ui/spinner";
interface UpdatePasswordViewProps {
  updatePasswordLoading: boolean;
  linkParsed: boolean;
  linkExpired: boolean;
  passwordShown: boolean;
  onEyeClick: () => void;
  onSubmit: (
    password: string,
    accessToken: string | null,
    refreshToken: string | null,
  ) => void;
}

export function UpdatePasswordView({
  updatePasswordLoading,
  passwordShown,
  onEyeClick,
  onSubmit,
  linkExpired,
  linkParsed,
}: UpdatePasswordViewProps) {
  return (
    <div className="grid h-full min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center bg-slate-100 text-black">
        <div>
          {!linkParsed ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="size-12" />
            </div>
          ) : linkExpired ? (
            <span className="flex flex-col justify-center items-center bg-slate-100 text-xl">
              <CircleAlert size={60} />
              This reset link has already been used or expired. Please request a
              new one.
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
