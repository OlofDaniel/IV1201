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
            <FieldLabel htmlFor="fieldgroup-email">First name</FieldLabel>
            <Input
              id="fieldgroup-email"
              type="email"
              placeholder="First name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="fieldgroup-email">Surname</FieldLabel>
            <Input id="fieldgroup-email" type="email" placeholder="Surname" />
          </Field>
          <Field>
            <FieldLabel htmlFor="fieldgroup-email">Person number</FieldLabel>
            <Input
              id="fieldgroup-email"
              type="email"
              placeholder="Person number"
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
            <Input id="fieldgroup-email" placeholder="Email" type="Email" />
          </Field>
          <Field>
            <FieldLabel htmlFor="fieldgroup-username">Username</FieldLabel>
            <Input id="fieldgroup-usename" placeholder="Username" />
          </Field>
          <Field>
            <FieldLabel htmlFor="fieldgroup-password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="fieldgroup-password"
                type={passwordShown ? "text" : "password"}
                placeholder="Password"
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
          </Field>
          <FieldDescription>
            Password must include letters and numbers
          </FieldDescription>
          <Field>
            <FieldLabel htmlFor="fieldgroup-password">
              Confirm password
            </FieldLabel>
            <div className="relative">
              <Input
                id="fieldgroup-password"
                type={passwordShown ? "text" : "password"}
                placeholder="Password"
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
          </Field>
        </FieldGroup>
      </div>

      <div className="flex justify-end">
        <Link href="/">
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
