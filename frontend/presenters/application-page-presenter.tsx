"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import { ApplicationPageView } from "@/views/application-page-view";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { AccessDeniedView } from "@/views/access-denied-view";

export function ApplicationPagePresenter() {
  const { user, loading, isAuthenticated, errorMessage } = useSelector(
    (state: RootState) => state.user,
  );

  const [selected, setSelected] = useState<Record<string, boolean>>({
    "ticket-sales": false,
    lotteries: false,
    "roller-coaster": false,
  });

  const [yearsOfExperience, setYearsOfExperience] = useState<
    Record<string, number>
  >({
    "ticket-sales": 0,
    lotteries: 0,
    "roller-coaster": 0,
  });

  const toggleCompetency = (id: string, checked: boolean) => {
    setSelected((prev) => ({ ...prev, [id]: checked }));
    if (!checked) setYearsOfExperience((prev) => ({ ...prev, [id]: 0 }));
  };

  const setYearsFor = (id: string, value: number) => {
    setYearsOfExperience((prev) => ({ ...prev, [id]: value }));
  };

  const COMPETENCIES = ["ticket-sales", "lotteries", "roller-coaster"];
  const submit = () => {
    const competencyPayload = Object.fromEntries(
      COMPETENCIES.map((id) => [
        id,
        selected[id] ? yearsOfExperience[id] : null,
      ]),
    );

    const payload = {
      competencies: competencyPayload,
      availability: dateRange,
    };

    console.log("Submit payload:", payload);
  };

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const application = {
    selected,
    yearsOfExperience,
    actions: {
      onToggle: toggleCompetency,
      onYearsChange: setYearsFor,
      onSubmit: submit,
      onDateChange: setDateRange,
    },
    dateRange,
  };
  if (loading) {
    return null;
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
      errorMessage={errorMessage}
      isAuthenticated={isAuthenticated}
      userLoading={loading}
      application={application}
    />
  );
}
