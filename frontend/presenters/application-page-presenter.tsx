"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import { ApplicationPageView } from "@/views/application-page-view";
import { useState } from "react";
import { DateRange } from "react-day-picker";

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
  const COMPETENCY_CODES: Record<string, number> = {
    "ticket-sales": 1,
    lotteries: 2,
    "roller-coaster": 3,
  };

  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);

  const addDateRange = () =>
    setDateRanges((prev) => [...prev, {} as DateRange]);

  const updateDateRange = (index: number, range: DateRange | undefined) =>
    setDateRanges((prev) =>
      prev.map((r, i) => (i === index ? (range ?? ({} as DateRange)) : r)),
    );

  const removeDateRange = (index: number) =>
    setDateRanges((prev) => prev.filter((_, i) => i !== index));

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
      availability: validRanges,
    };

    console.log("Submit payload:", payload);
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

  return (
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
