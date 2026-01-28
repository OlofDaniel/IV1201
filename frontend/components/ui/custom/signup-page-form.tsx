import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function SignupPageForm() {
  return (
    <form className="w-110">
      {/* Personal information */}
      <div className="p-5 rounded-xl border-[0.5px] border-black/10 bg-black/[0.02]">
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

      <div className="p-5 rounded-xl border-[0.5px] border-black/10 bg-black/[0.02] my-5">
        <h2 className="mb-2 font-bold">Account information</h2>
        <FieldGroup>
          {/* Account information */}
          <Field className="">
            <FieldLabel htmlFor="fieldgroup-name">Email</FieldLabel>
            <Input id="fieldgroup-name" placeholder="Email" />
          </Field>
          <Field>
            <FieldLabel htmlFor="fieldgroup-email">Username</FieldLabel>
            <Input id="fieldgroup-email" type="email" placeholder="Username" />
            {/* <FieldDescription>
            We&apos;ll send updates to this address.
          </FieldDescription> */}
          </Field>
          <Field>
            <FieldLabel htmlFor="fieldgroup-email">Password</FieldLabel>
            <Input id="fieldgroup-email" type="email" placeholder="Password" />
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
