import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/*
  View layout of the home page view:
  Image: displays a blurred image in the background of the page
  Link: provides the functionality to navigate to the signup page in the form of a button
*/
export function HomePageView() {
  return (
    <div>
      <div className="relative w-full h-[95vh] overflow-hidden">
        <Image
          src="/amuse1.jpg"
          alt="Amusement park"
          fill
          className="blur-sm object-cover scale-185 brightness-75"
        />
        <div className="absolute flex-col flex justify-center items-center mt-50 w-full">
          <h1 className=" text-white text-6xl text-center">
            Season job application
          </h1>
          <p className=" text-white text-center mt-2 text-xl">
            Welcome to us at The Amusement Park
          </p>
          <p className=" text-white text-center mt-10 px-10 text-xl max-w-200">
            In order to make an application you first have to create an account,
            where you can make applications as well as review your applications.
          </p>
          <Link href="/signup">
            <Button className="mt-10" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
