import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface SignupPageFormProps {
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

export function SignupPageForm({
  passwordShown,
  signupLoading,
  errorMessage,
  onEyeClick,
  onSignupClick,
}: SignupPageFormProps) {
  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstname = formData.get("fieldgroup-firstname") as string;
    const surname = formData.get("fieldgroup-surname") as string;
    const personNumber = formData.get("fieldgroup-personNumber") as string;
    const email = formData.get("fieldgroup-email") as string;
    const username = formData.get("fieldgroup-username") as string;
    const password = formData.get("fieldgroup-password") as string;

    onSignupClick(firstname, surname, personNumber, email, username, password);
  }

  return (
    <form className="w-110" onSubmit={handleFormSubmit}>
      {/* Personal information */}
      <div className="p-5 rounded-md border-[0.5px] border-black/10 bg-black/[0.02]">
        <h2 className="mb-2 font-bold">Personal information</h2>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="fieldgroup-firstname">First name</FieldLabel>
            <Input
              id="fieldgroup-firstname"
              name="fieldgroup-firstname"
              type="text"
              placeholder="First name"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="fieldgroup-surname">Surname</FieldLabel>
            <Input
              id="fieldgroup-surname"
              name="fieldgroup-surname"
              type="text"
              placeholder="Surname"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="fieldgroup-personNumber">
              Person number
            </FieldLabel>
            <Input
              id="fieldgroup-personNumber"
              name="fieldgroup-personNumber"
              type="text"
              placeholder="Person number"
              required
            />
          </Field>
        </FieldGroup>
      </div>

      <div className="p-5 rounded-md border-[0.5px] border-black/10 bg-black/[0.02] my-5">
        <h2 className="mb-2 font-bold">Account information</h2>
        <FieldGroup>
          {/* Account information */}
          <Field className="">
            <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
            <Input
              id="fieldgroup-email"
              name="fieldgroup-email"
              placeholder="Email"
              type="Email"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="fieldgroup-username">Username</FieldLabel>
            <Input
              id="fieldgroup-username"
              name="fieldgroup-username"
              placeholder="Username"
              type="text"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="fieldgroup-password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="fieldgroup-password"
                name="fieldgroup-password"
                type={passwordShown ? "text" : "password"}
                placeholder="Password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" // regex limits password to meet requirements (must contain: capital, lowercase, number and be 8 characters min.)
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
            </div>
          </Field>
          <FieldDescription>
            Password must include at least one number and one uppercase and
            lowercase letter and contain 8 or more characters
          </FieldDescription>
          <Field>
            <FieldLabel htmlFor="fieldgroup-confirmPassword">
              Confirm password
            </FieldLabel>
            <div className="relative">
              <Input
                id="fieldgroup-confirmPassword"
                name="fieldgroup-confirmPassword"
                type={passwordShown ? "text" : "password"}
                placeholder="Password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" // limits password to meet requirements (must contain: capital, lowercase, number and be 8 characters min.)
                required
              />
              <button
                type="button"
                aria-label={
                  passwordShown
                    ? "hide confirm password"
                    : "show confirm password"
                }
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
          </Field>
        </FieldGroup>
      </div>

      <div className="flex justify-end">
        <Link href="/" aria-label="cancel signup">
          <Button className="ml-5" variant="outline" disabled={signupLoading}>
            Cancel
          </Button>
        </Link>
        <Button className="ml-5" type="submit" disabled={signupLoading}>
          {signupLoading ? <Spinner className="size-4" /> : "Sign up"}
        </Button>
      </div>
    </form>
  );
}
