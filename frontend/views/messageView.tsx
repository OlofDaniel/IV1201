interface MessageViewProps {
  message: string;
  storeButtonClicked: () => void;
}

export function MessageView({ message, storeButtonClicked }: MessageViewProps) {
  return (
    <div>
      <h1>{message}</h1>
      <button onClick={storeButtonClicked}>get message from store</button>
    </div>
  );
}
