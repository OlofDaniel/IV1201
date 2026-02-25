import { Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
/*
  View layout of access denied view:
  Is shown any time a user tries to access a page they are not authorized to see.

*/
export function AccessDeniedView() {
  return (
    <div className="flex items-center justify-center h-[95vh] w-full bg-gray-50">
      <div className="text-center">
        <Lock className="mx-auto mt-4 text-gray-500" size={56} />
        <Separator className="my-4" />
        <p className="mt-4 text-xl text-gray-700">
          You do not have access to this page.
        </p>
      </div>
    </div>
  );
}
