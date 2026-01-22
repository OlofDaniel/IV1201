"use client";
import { MessageView } from "@/views/messageView";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchMessageThunk } from "@/communication/messageComm";

export function MessagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const { message } = useSelector((state: RootState) => state.message);
  const { loading } = useSelector((state: RootState) => state.message);
  const { error } = useSelector((state: RootState) => state.message);
  const storeButtonClicked = () => {
    dispatch(fetchMessageThunk());
  };
  return (
    <MessageView
      loading={loading}
      message={message}
      storeButtonClicked={storeButtonClicked}
      error={error}
    ></MessageView>
  );
}
