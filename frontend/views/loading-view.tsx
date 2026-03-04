import { Separator } from "@/components/ui/separator";
import { Loader } from "@/components/ui/loader";
/*
  View layout of loading view:
  Is shown any time a user is waiting for a page to load.

*/
export function LoaderView() {
  return (
    <div className="flex items-center justify-center h-[95vh] w-full bg-gray-50">
      <div className="text-center">
        <Loader className="mx-auto mt-4 text-gray-500 size-14" />
        <Separator className="my-4" />
      </div>
    </div>
  );
}
