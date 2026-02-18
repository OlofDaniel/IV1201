"use client";

import { useEffect, useRef } from "react";
import { getUserInfoThunk } from "@/communication/user-info-commmunication";
import { useAppDispatch } from "@/lib/Redux/hooks";

/* A function that is used to load user information into state store when website reloads which resets the state store*/

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
