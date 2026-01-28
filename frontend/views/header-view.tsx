import { Button } from "@/components/ui/button";
import { User, UserPlus } from "lucide-react";
import Link from "next/link";

interface headerViewProps {
  onLoginClick: () => void;
}

export function HeaderView({ onLoginClick }: headerViewProps) {
  return (
    <div className="grid grid-cols-3 items-center bg-neutral-200 py-5">
      <span></span>
      <span className="justify-self-center text-5xl font-serif">
        Amusement Park
      </span>
      <div className="flex justify-self-end gap-5 mr-5">
        <Button className="w-25" onClick={onLoginClick}>
          <User />
          Login
        </Button>
        <Link href="/signup">
          <Button className="w-25">
            <UserPlus />
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
}
