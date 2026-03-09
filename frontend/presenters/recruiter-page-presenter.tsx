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
    setSaveSuccess,
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
    errorMessages,
    selectedApplication,
    saveSuccess,
    getApplicationLoading,
    applicationDetails,
  } = useSelector((state: RootState) => state.recruiter);

  const { user, loading: userLoading } = useSelector(
    (state: RootState) => state.user,
  );

  /*Triggers attempt to load applications on reload*/
  useEffect(() => {
    if (
      applications.length === 0 &&
      !applicationsLoading &&
      user?.role === "recruiter" &&
      errorMessages.getApplicationsError === null
    ) {
      dispatch(getApplicationsThunk());
    }
  }, [
    dispatch,
    applications.length,
    applicationsLoading,
    user?.role,
    errorMessages.getApplicationsError,
  ]);

  /* Dispatches the setNewStatus action when a status is changed,
   adds to a list of user_ids and their new statuses */
  const onStatusChange = (id: string, newStatus: Application["status"]) =>
    dispatch(setNewStatus({ id, newStatus }));

  /* When a row is clicked the application for that applicant is fetched */
  const onRowClick = (app: Application) => {
    if (selectedApplication?.id === app.id) {
      dispatch(setSelectedApplication(null));
    } else {
      dispatch(getApplicationThunk({ person_id: parseInt(app.id) }));
      dispatch(setSelectedApplication(app));
    }
  };

  /* Closes the detailed view of an application*/
  const onCloseRowClick = () => dispatch(setSelectedApplication(null));

  const hasPendingChanges = updatedApplications.length > 0;

  /* Dispatches the postApplicationUpdateThunk with the new statuses when save changes is clicked */
  const onSaveChangesClick = () => {
    dispatch(postApplicationUpdateThunk(updatedApplications));
  };

  /* Provides toast notifications of saved status changes */
  useEffect(() => {
    if (errorMessages.saveChangesError) {
      toast.error(errorMessages.saveChangesError, { position: "top-center" });
    } else if (saveSuccess) {
      toast.success("Successfully saved changes", { position: "top-center" });
      dispatch(setSaveSuccess(false))
    }
  }, [errorMessages.saveChangesError, saveSuccess, dispatch]);

  /* Empties the list of changed statuses */
  const onCancelChangesClick = () => {
    dispatch(cancelStatusChanges());
  };
  return user?.role !== "recruiter" && !userLoading ? (
    <AccessDeniedView />
  ) : (
    <RecruiterPageView
      applications={applications}
      selectedApplication={selectedApplication}
      applicationsLoading={applicationsLoading || userLoading}
      saveChangesLoading={saveChangesLoading}
      errorMessages={errorMessages}
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
