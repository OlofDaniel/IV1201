"use client";
import { MessageView } from "@/views/messageView";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { setMessage } from "@/models/messageSlice";

export function MessagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const { message } = useSelector((state: RootState) => state.message);
  const storeButtonClicked = () => {
    dispatch(setMessage("Altered from button click"));
  };
  return (
    <MessageView
      message={message}
      storeButtonClicked={storeButtonClicked}
    ></MessageView>
  );
}
