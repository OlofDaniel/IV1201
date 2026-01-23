import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonDefault } from "@/components/ui/madeComponents/getMessageButton";
import { SpinnerBadge } from "@/components/ui/madeComponents/loadingSpinner";

interface MessageViewProps {
  message: string;
  getLoading: boolean;
  postLoading: boolean;
  storeButtonClicked: () => void;
  sendButtonClicked: () => void;
  error: boolean;
  inputText: string;
  onInputChange: (value: string) => void;
}

export function MessageView({
  message,
  getLoading,
  postLoading,
  storeButtonClicked,
  sendButtonClicked,
  error,
  onInputChange,
  inputText,
}: MessageViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="text-center text-2xl uppercase mt-10 w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>
            <span>{message}</span>
            {getLoading && <SpinnerBadge />}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <Input
            className="w-full max-w-xs text-sm h-9"
            placeholder="Type a message for the backend..."
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
          ></Input>
          <Button
            size={"sm"}
            disabled={postLoading}
            onClick={sendButtonClicked}
          >
            Send message to the backend
          </Button>
          <ButtonDefault disabled={getLoading} onClick={storeButtonClicked}>
            Get message from backend
          </ButtonDefault>
        </CardContent>
      </Card>
    </div>
  );
}
