"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { RecruiterPageView } from "@/views/recruiter-page-view";
import { getApplicationsThunk } from "@/communication/recruiter-applications-communication";
import {
  setNewStatus,
  setSelectedApplication,
  Application,
} from "@/models/Redux/recruiter-slice";

export function RecruiterPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    applications,
    applicationsLoading,
    errorMessage,
    selectedApplication,
  } = useSelector((state: RootState) => state.recruiter);

  useEffect(() => {
    if (applications.length === 0 && !applicationsLoading) {
      dispatch(getApplicationsThunk());
    }
  }, [dispatch, applications.length, applicationsLoading]);

  const onStatusChange = (id: string, newStatus: Application["status"]) =>
    dispatch(setNewStatus({ id, newStatus }));

  const onRowClick = (app: Application) => {
    if (selectedApplication?.id === app.id) {
      dispatch(setSelectedApplication(null));
    } else {
      dispatch(setSelectedApplication(app));
    }
  };

  const onCloseRowClick = () => dispatch(setSelectedApplication(null));

  return (
    <RecruiterPageView
      applications={applications}
      selectedApplication={selectedApplication}
      applicationsLoading={applicationsLoading}
      errorMessage={errorMessage}
      onStatusChange={onStatusChange}
      onRowClick={onRowClick}
      onCloseRowClick={onCloseRowClick}
    ></RecruiterPageView>
  );
}
