import { Button } from "@/components/ui/button";

interface buttonProps {
  disabled: boolean;
  onClick: () => void;
  children: string;
}

export function ButtonDefault({ disabled, onClick, children }: buttonProps) {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      className="bg-white text-black hover:bg-gray-400 cursor-pointer"
      size={"sm"}
    >
      {children}
    </Button>
  );
}
