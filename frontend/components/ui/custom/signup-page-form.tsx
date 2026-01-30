import { Button } from "@/components/ui/button";
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
  onEyeClick: () => void;
}

export function SignupPageForm({
  passwordShown,
  onEyeClick,
}: SignupPageFormProps) {
  // Placeholder to avoid error and site reload on button presses --------
  const onClickPlaceholder = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("signup form submit");
  };
  // Placeholder to avoid error and site reload on button presses --------
  return (
    <form className="w-110" onSubmit={onClickPlaceholder}>
      {/* Personal information */}
      <div className="p-5 rounded-md border-[0.5px] border-black/10 bg-black/[0.02]">
        <h2 className="mb-2 font-bold">Personal information</h2>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="fieldgroup-first-name">First name</FieldLabel>
            <Input
              id="fieldgroup-first-name"
              name="fieldgroup-first-name"
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
            <FieldLabel htmlFor="fieldgroup-person-number">
              Person number
            </FieldLabel>
            <Input
              id="fieldgroup-person-number"
              name="fieldgroup-person-number"
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
            Password must include letters and numbers
          </FieldDescription>
          <Field>
            <FieldLabel htmlFor="fieldgroup-confirm-password">
              Confirm password
            </FieldLabel>
            <div className="relative">
              <Input
                id="fieldgroup-confirm-password"
                name="fieldgroup-confirm-password"
                type={passwordShown ? "text" : "password"}
                placeholder="Password"
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
          <Button className="ml-5" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button className="ml-5" type="submit">
          Sign up
        </Button>
      </div>
    </form>
  );
}
