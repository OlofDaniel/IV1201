import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface PasswordResetFormProps {
  loading: boolean;
  errorMessage: string | null;
  onSubmit: (email: string) => void;
}

export function PasswordResetForm({
  loading,
  errorMessage,
  onSubmit,
}: PasswordResetFormProps) {
  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("fieldgroup-email") as string;

    onSubmit(email);
  }

  return (
    <form className="w-110" onSubmit={handleFormSubmit}>
      <div className="p-5 rounded-md border-[0.5px] border-black/10 bg-black/[0.02]">
        <h2 className="mb-2 font-bold">Forgotten Password</h2>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="fieldgroup-email">
              Enter your email adress to get a password link
            </FieldLabel>
            <Input
              id="fieldgroup-email"
              name="fieldgroup-email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </Field>
        </FieldGroup>

        {errorMessage && (
          <p className="mt-3 text-sm text-red-500">{errorMessage}</p>
        )}
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
