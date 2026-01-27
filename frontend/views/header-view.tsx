import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

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
      <Button className="justify-self-end w-25 mr-5" onClick={onLoginClick}>
        <User />
        LOGIN
      </Button>
    </div>
  );
}
