"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/lib/Redux/hooks";
import { getApplicationThunk } from "@/communication/application-communication";
import { RootState } from "@/lib/Redux/store";
import { useSelector } from "react-redux";

/* A function that is used to load user information into state store when website reloads which resets the state store*/

export default function ApplicationSync() {
  const dispatch = useAppDispatch();
  const isInitialized = useRef(false);

  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log("ApplicationSync useEffect triggered");

    if (!isInitialized.current && user?.person_id) {
      dispatch(getApplicationThunk({ person_id: user.person_id }));
      isInitialized.current = true;
    }
  }, [dispatch, user?.person_id]);

  return null;
}
