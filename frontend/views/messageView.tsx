import { ButtonDefault } from "@/components/ui/madeComponents/getMessageButton";
import { SpinnerBadge } from "@/components/ui/madeComponents/loadingSpinner";

interface MessageViewProps {
  message: string;
  loading: boolean;
  storeButtonClicked: () => void;
  error: boolean;
}

export function MessageView({
  message,
  loading,
  storeButtonClicked,
  error,
}: MessageViewProps) {
  return (
    <div className="">
      <h1 className="text-center text-2xl uppercase mt-10">{message}</h1>
      <div className="flex justify-center mt-5">
        <ButtonDefault disabled={loading} onClick={storeButtonClicked}>
          Get message from backend
        </ButtonDefault>
      </div>
      <div className="flex justify-center my-2">
        {loading ? <SpinnerBadge></SpinnerBadge> : null}
      </div>
    </div>
  );
}
