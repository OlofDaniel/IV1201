"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { RecruiterPageView } from "@/views/recruiter-page-view";
import { AccessDeniedView } from "@/views/access-denied-view";
import {
  getApplicationsThunk,
  postApplicationUpdateThunk,
} from "@/communication/recruiter-applications-communication";
import {
  setNewStatus,
  setSelectedApplication,
  cancelStatusChanges,
  Application,
} from "@/models/Redux/recruiter-slice";
import { toast } from "sonner";
import { getApplicationThunk } from "@/communication/application-communication";

export function RecruiterPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    applications,
    updatedApplications,
    applicationsLoading,
    saveChangesLoading,
    errorMessage,
    selectedApplication,
    saveSuccess,
    getApplicationLoading,
    applicationDetails,
  } = useSelector((state: RootState) => state.recruiter);

  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (
      applications.length === 0 &&
      !applicationsLoading &&
      user?.role === "recruiter"
    ) {
      dispatch(getApplicationsThunk());
    }
  }, [dispatch, applications.length, applicationsLoading, user?.role]);

  const onStatusChange = (id: string, newStatus: Application["status"]) =>
    dispatch(setNewStatus({ id, newStatus }));

  const onRowClick = (app: Application) => {
    if (selectedApplication?.id === app.id) {
      dispatch(setSelectedApplication(null));
    } else {
      dispatch(getApplicationThunk({ person_id: parseInt(app.id) }));
      dispatch(setSelectedApplication(app));
    }
  };

  const onCloseRowClick = () => dispatch(setSelectedApplication(null));

  const hasPendingChanges = updatedApplications.length > 0;

  const onSaveChangesClick = () => {
    dispatch(postApplicationUpdateThunk(updatedApplications));
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage, { position: "top-center" });
    } else if (saveSuccess) {
      toast.success("Successfully saved changes", { position: "top-center" });
    }
  }, [errorMessage, saveSuccess]);

  const onCancelChangesClick = () => {
    dispatch(cancelStatusChanges());
  };

  return user?.role !== "recruiter" ? (
    <AccessDeniedView />
  ) : (
    <RecruiterPageView
      applications={applications}
      selectedApplication={selectedApplication}
      applicationsLoading={applicationsLoading}
      saveChangesLoading={saveChangesLoading}
      errorMessage={errorMessage}
      hasPendingChanges={hasPendingChanges}
      onStatusChange={onStatusChange}
      onRowClick={onRowClick}
      onCloseRowClick={onCloseRowClick}
      onSaveChangesClick={onSaveChangesClick}
      onCancelChangesClick={onCancelChangesClick}
      getApplicationLoading={getApplicationLoading}
      applicationDetails={applicationDetails}
    ></RecruiterPageView>
  );
}
