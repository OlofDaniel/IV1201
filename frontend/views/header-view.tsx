import { Button } from "@/components/ui/button";
import { User, UserPlus, ShieldUser, Menu, Ghost } from "lucide-react";
import Link from "next/link";

import {
  CustomDropdownMenu,
  dropdownItem,
} from "@/components/ui/custom/Customdropdown-menu";

interface headerViewProps {
  onLoginClick: () => void;
}

export function HeaderView({ onLoginClick }: headerViewProps) {
  const menuItems: dropdownItem[] = [
    { label: "Login", icon: User, separator: false, onClick: onLoginClick },
    {
      label: "Sign up",
      icon: UserPlus,
      separator: true,
      href: "/signup",
    },
    {
      label: "Recruiter",
      icon: ShieldUser,
      separator: false,
      href: "/recruiter",
    },
  ];

  return (
    <div className="grid grid-cols-3 items-center bg-neutral-200 py-5">
      <div className="flex">
        <div className="hidden lg:block ml-3">
          <Link href="/recruiter">
            <Button className="w-25" variant="link">
              <ShieldUser />
              Recruiter
            </Button>
          </Link>
        </div>
      </div>
      <span className="justify-self-center text-2xl md:text-5xl font-serif whitespace-nowrap">
        The Amusement Park
      </span>
      <div className="justify-self-end mr-5">
        <div className="hidden lg:flex">
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
        <div className="lg:hidden">
          <CustomDropdownMenu
            items={menuItems}
            trigger={
              <Button variant="ghost" className="w-10">
                <Menu />
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
