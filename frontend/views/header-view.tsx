import { Button } from "@/components/ui/button";
import { User, UserPlus, ShieldUser } from "lucide-react";
import Link from "next/link";

interface headerViewProps {
  onLoginClick: () => void;
}

export function HeaderView({ onLoginClick }: headerViewProps) {
  return (
    <div className="grid grid-cols-3 items-center bg-neutral-200 py-5">
      <span className="ml-3">
        <Link href="/recruiter">
          <Button className="w-25" variant="link">
            <ShieldUser />
            Recruiter
          </Button>
        </Link>
      </span>
      <span className="justify-self-center text-5xl font-serif">
        Amusement Park
      </span>
      <div className="flex justify-self-end mr-5">
        <Button variant="link" className="w-25" onClick={onLoginClick}>
          <User />
          Login
        </Button>
        <Link href="/signup">
          <Button className="w-25" variant="link">
            <UserPlus />
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
}
