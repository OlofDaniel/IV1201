import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import { SkeletonCard } from "@/components/ui/custom/card-skeleton";

interface ProfilePageViewProps {
  username: string | null;
  first_name: string | null;
  surname: string | null;
  email: string | null;
  person_number: string | null;
  errorMessage: string | null;
  isAuthenticated: boolean;
  userLoading: boolean;
}

/*
  View layout of the user profile view:
  Image: displays a blurred image in the background of the page
  SkeletonCard: A placeholder when the user information is getting fetched from supabase
*/
export function ProfilePageView({
  username,
  first_name,
  surname,
  email,
  person_number,
  errorMessage,
  isAuthenticated,
  userLoading,
}: ProfilePageViewProps) {
  return userLoading ? (
    <div className="flex justify-center mt-20">
      <SkeletonCard />
    </div>
  ) : isAuthenticated ? (
    <div className="relative w-full h-[95vh] overflow-hidden">
      <Image
        src="/amuse1.jpg"
        alt="Amusement park"
        fill
        className="-z-10 blur-sm object-cover scale-185 brightness-75"
      />

      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="flex justify-center mt-20 w-full">
          <Card className="bg-neutral-200 w-full max-w-lg">
            <CardHeader>
              <CardTitle>
                {first_name} {surname}
              </CardTitle>
              <CardDescription>This is your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-2 border-t pt-4">
                <span className="font-bold">Username:</span>{" "}
                <span>{username}</span>
                <span className="font-bold">First name:</span>{" "}
                <span>{first_name}</span>
                <span className="font-bold">Surname:</span>{" "}
                <span>{surname}</span>
                <span className="font-bold">Email:</span> <span>{email}</span>
                <span className="font-bold">Person number:</span>
                {person_number}
              </div>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </div>

        <div className="flex justify-center mt-20 w-full">
          <Card className="bg-neutral-200 w-full max-w-5xl">
            <CardHeader className="flex justify-center">
              <CardTitle>Application</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center mt-20">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center">
            Please login to see your profile
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
