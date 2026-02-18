"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

const COMPETENCIES = [
  { id: "ticket-sales", label: "Ticket sales" },
  { id: "lotteries", label: "Lotteries" },
  { id: "roller-coaster", label: "Roller coaster operation" },
];

export function CompetensSelection() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const handleToggle = (id: string, checked: boolean) => {
    setSelected((prev) => ({ ...prev, [id]: checked }));
  };

  return (
    <FieldSet>
      <FieldLegend variant="label">
        Please select your competencies from the list below:
      </FieldLegend>
      <FieldDescription>
        Select your competencies and specify your years of experience.
      </FieldDescription>

      <FieldGroup className="gap-4 mt-4">
        {COMPETENCIES.map((comp) => {
          const isChecked = selected[comp.id] || false;

          return (
            <div
              key={comp.id}
              className="my-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full max-w-md"
            >
              <Field orientation="horizontal" className="flex-1">
                <Checkbox
                  id={comp.id}
                  name={comp.id}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleToggle(comp.id, checked as boolean)
                  }
                />
                <FieldLabel
                  htmlFor={comp.id}
                  className="font-normal cursor-pointer"
                >
                  {comp.label}
                </FieldLabel>
              </Field>

              {isChecked && (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                  <Input
                    type="number"
                    name={`${comp.id}-years`}
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                    className="w-20 h-8"
                  />
                  <span className="text-sm text-muted-foreground">years</span>
                </div>
              )}
            </div>
          );
        })}
      </FieldGroup>
    </FieldSet>
  );
}
