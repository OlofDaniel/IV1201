"use client";
import { MessageView } from "@/views/messageView";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchMessageThunk,
  postMessageThunk,
} from "@/communication/messageComm";
import { setInputText } from "@/models/messageSlice";

export function MessagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const { message } = useSelector((state: RootState) => state.message);
  const { inputText } = useSelector((state: RootState) => state.message);
  const { getLoading } = useSelector((state: RootState) => state.message);
  const { postLoading } = useSelector((state: RootState) => state.message);
  const { error } = useSelector((state: RootState) => state.message);
  const storeButtonClicked = () => {
    dispatch(fetchMessageThunk());
  };
  const sendButtonClicked = () => {
    dispatch(postMessageThunk(inputText));
  };
  const onTextChange = (text: string) => {
    dispatch(setInputText(text));
  };
  return (
    <MessageView
      getLoading={getLoading}
      postLoading={postLoading}
      message={message}
      storeButtonClicked={storeButtonClicked}
      sendButtonClicked={sendButtonClicked}
      onInputChange={onTextChange}
      inputText={inputText}
      error={error}
    ></MessageView>
  );
}
