import {
  SignupPageForm,
  SignupPageFormProps,
} from "@/components/ui/custom/signup-page-form";
import Image from "next/image";
import { House } from "lucide-react";
import Link from "next/link";

interface SignupPageViewProps {
  passwordShown: boolean;
  signupLoading: boolean;
  errorMessage: string | null;
  onEyeClick: () => void;
  onSignupClick: (
    firstname: string,
    surname: string,
    personNumber: string,
    email: string,
    username: string,
    password: string,
  ) => void;
}

export function SignupPageView(SignupProps: SignupPageViewProps) {
  return (
    <div className="grid h-full min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center bg-slate-100 text-black">
        <Link href="/">
          <House size={30} className="flex absolute top-5 left-5" />
        </Link>
        <div>
          <h1 className="text-4xl font-bold ml-5 mb-5">Sign up</h1>
          <SignupPageForm {...SignupProps} />
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image
          src="/amusementpark2.jpg"
          alt="Amusement park"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
