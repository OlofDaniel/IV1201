"use client";

import { useEffect, useRef } from "react";
import { getUserInfoThunk } from "@/communication/user-info-commmunication";
import { useAppDispatch } from "@/lib/Redux/hooks";

export default function UserSync() {
  const dispatch = useAppDispatch();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      dispatch(getUserInfoThunk());
      isInitialized.current = true;
    }
  }, [dispatch]);

  return null;
}
