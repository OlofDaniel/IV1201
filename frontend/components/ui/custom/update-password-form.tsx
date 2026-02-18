import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface UpdatePasswordFormProps {
  loading: boolean;
  passwordShown: boolean;
  onSubmit: (
    password: string,
    accessToken: string | null,
    refreshToken: string | null,
  ) => void;
  onEyeClick: () => void;
}

export function UpdatePasswordForm({
  loading,
  passwordShown,
  onEyeClick,
  onSubmit,
}: UpdatePasswordFormProps) {
  function handleConfirmPassword(): boolean {
    const password = document.querySelector(
      "input[name=fieldgroup-password]",
    ) as HTMLInputElement;
    const confirmPassword = document.querySelector(
      "input[name=fieldgroup-confirmPassword]",
    ) as HTMLInputElement;

    if (confirmPassword.value != password.value) {
      confirmPassword.setCustomValidity("Passwords do not match");
      confirmPassword.reportValidity();
      return false;
    }

    confirmPassword.setCustomValidity("");
    return true;
  }

  /*Workaround since supabase expects the call to be made from this URL, not the backend. 
  Reads the URL of the form page when submitted to get the relevant tokens.*/
  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!handleConfirmPassword()) {
      return;
    }
    const params = new URLSearchParams(window.location.hash.slice(1));

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const formData = new FormData(event.currentTarget);
    const password = formData.get("fieldgroup-password") as string;

    onSubmit(password, accessToken, refreshToken);
  }

  return (
    <form className="w-110" onSubmit={handleFormSubmit}>
      <div className="p-5 rounded-md border-[0.5px] border-black/10 bg-black/[0.02]">
        <h2 className="mb-2 font-bold">Change Password</h2>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="fieldgroup-password">
              Type your new password
            </FieldLabel>
            <div className="relative">
              <Input
                id="fieldgroup-password"
                name="fieldgroup-password"
                type={passwordShown ? "text" : "password"}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                placeholder="Enter your new password"
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
          <Field>
            <FieldLabel htmlFor="fieldgroup-confirmPassword">
              Confirm your new password
            </FieldLabel>
            <div className="relative">
              <Input
                id="fieldgroup-confirmPassword"
                name="fieldgroup-confirmPassword"
                type={passwordShown ? "text" : "password"}
                placeholder="Re-enter your new password"
                onInput={
                  (e) =>
                    (e.currentTarget as HTMLInputElement).setCustomValidity("") // clears confirm password validation state on user input
                }
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

      <div className="flex justify-end mt-5">
        <Link href="/" aria-label="cancel">
          <Button className="ml-5" variant="outline" disabled={loading}>
            Cancel
          </Button>
        </Link>

        <Button className="ml-5" type="submit" disabled={loading}>
          {loading ? <Spinner className="size-4" /> : "Continue"}
        </Button>
      </div>
    </form>
  );
}
