"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/Redux/store";
import { ApplicationPageView } from "@/views/application-page-view";
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { AccessDeniedView } from "@/views/access-denied-view";
import { postApplicationThunk } from "@/communication/application-communication";
import { toast } from "sonner";
import { ApplicationCard } from "@/components/ui/custom/application-card";
import { LoaderView } from "@/views/loading-view";

export function ApplicationPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    user,
    loading: userLoading,
    isAuthenticated,
    errorMessage: userErrorMessage,
  } = useSelector((state: RootState) => state.user);
  const {
    loading: postApplicationLoading,
    getApplicationLoading,
    errorMessage: applicationErrorMessage,
    applicationSentSuccess,
    currentApplication,
  } = useSelector((state: RootState) => state.application);

  /*useEffect: shows a toast with either an error message or a success-message after a user sends application*/

  useEffect(() => {
    if (applicationErrorMessage) {
      toast.error(applicationErrorMessage, { position: "top-center" });
    } else if (applicationSentSuccess) {
      toast.success("Sucessfully submitted application", {
        position: "top-center",
      });
    }
  }, [applicationErrorMessage, applicationSentSuccess]);

 /*React state for the selected competencies*/

  const [selected, setSelected] = useState<Record<string, boolean>>({
    "ticket-sales": false,
    lotteries: false,
    "roller-coaster": false,
  });

  /*React state for the years of experience*/

  const [yearsOfExperience, setYearsOfExperience] = useState<
    Record<string, number>
  >({
    "ticket-sales": 0,
    lotteries: 0,
    "roller-coaster": 0,
  });

  /*Function that toggles the competency when a user checks a box in the app.*/

  const toggleCompetency = (id: string, checked: boolean) => {
    setSelected((prev) => ({ ...prev, [id]: checked }));
    if (!checked) setYearsOfExperience((prev) => ({ ...prev, [id]: 0 }));
  };

  /*Function that sets the years of experience to a specific competence.*/

  const setYearsFor = (id: string, value: number) => {
    setYearsOfExperience((prev) => ({ ...prev, [id]: value }));
  };

  const COMPETENCIES = ["ticket-sales", "lotteries", "roller-coaster"];
  const COMPETENCY_CODES: Record<string, number> = {
    "ticket-sales": 1,
    lotteries: 2,
    "roller-coaster": 3,
  };

  /*React state for the availability date ranges*/

  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);

  /*Function that adds a date range to the state of availability date ranges*/

  const addDateRange = () =>
    setDateRanges((prev) => [...prev, {} as DateRange]);

  /*Function that updates the date range for a specific range*/

  const updateDateRange = (index: number, range: DateRange | undefined) =>
    setDateRanges((prev) =>
      prev.map((r, i) => (i === index ? (range ?? ({} as DateRange)) : r)),
    );

  /*Function that removes a specific range for the data ranges*/

  const removeDateRange = (index: number) =>
    setDateRanges((prev) => prev.filter((_, i) => i !== index));


  /*submit function that collects the data from the application form and formats it and dispatches it to postApplicationThunk.
    validRanges: filters the data ranges to only keep the correct format with a from and to date.
    sets the date ranges state with validRanges.
    builds the payload with the validRanges, which are formatted to the correct format. Also adds the competences and the person_id.
  */

  const submit = () => {
    const competencyPayload = Object.fromEntries(
      COMPETENCIES.map((id) => [
        id,
        selected[id] ? yearsOfExperience[id] : null,
      ]),
    );

    const validRanges = dateRanges.filter((r) => r?.from && r?.to);

    setDateRanges(validRanges);

    const payload = {
      competencies: competencyPayload,
      availability: validRanges.map((r) => ({
        from_date: r.from!.toISOString(),
        to_date: r.to!.toISOString(),
      })),
      person_id: user?.person_id ?? null,
    };

    console.log(
      "Submit payload:",
      typeof payload.competencies,
      typeof payload.availability,
    );
    dispatch(postApplicationThunk(payload));
  };

  const application = {
    selected,
    yearsOfExperience,
    actions: {
      onToggle: toggleCompetency,
      onYearsChange: setYearsFor,
      onSubmit: submit,
      onAddDateRange: addDateRange,
      onUpdateDateRange: updateDateRange,
      onRemoveDateRange: removeDateRange,
    },
    dateRanges,
  };
  if (userLoading || getApplicationLoading) {
    return <LoaderView />;
  }
  if (currentApplication) {
    return (
      <ApplicationCard
        competencies={currentApplication.competencies}
        availability={currentApplication.availability}
        status={currentApplication.status.application_status}
      />
    );
  }
  return user?.role !== "applicant" ? (
    <AccessDeniedView />
  ) : (
    <ApplicationPageView
      first_name={user?.first_name ?? ""}
      username={user?.username ?? ""}
      surname={user?.surname ?? ""}
      email={user?.email ?? ""}
      person_number={user?.person_number ?? ""}
      errorMessage={userErrorMessage}
      isAuthenticated={isAuthenticated}
      userLoading={userLoading}
      application={application}
    />
  );
}
