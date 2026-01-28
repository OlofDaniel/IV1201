import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideIcon } from "lucide-react";

export interface dropdownItem {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  href?: string;
  separator: boolean;
}

interface dropdownProps {
  trigger: React.ReactNode;
  items: dropdownItem[];
}

export function CustomDropdownMenu({ trigger, items }: dropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item, index) => (
          <div key={index}>
            <DropdownMenuItem onClick={item.onClick} className="cursor-pointer">
              {item.href ? (
                <Link href={item.href} className="flex w-full items-center">
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <div className="flex w-full items-center justi">
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  <span>{item.label}</span>
                </div>
              )}
            </DropdownMenuItem>
            {item.separator && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
