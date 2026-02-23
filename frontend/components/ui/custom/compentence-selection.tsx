"use client";
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
  { id: "lotteries", label: "Lotteries" },
  { id: "roller-coaster", label: "Roller Coaster Operations" },
  { id: "ticket-sales", label: "Ticket Sales" },
];

interface CompetensSelectionProps {
  selected: Record<string, boolean>;
  onToggle: (id: string, checked: boolean) => void;
  onYearsChange: (id: string, years: number) => void;
  yearsOfExperience: Record<string, number>;
}

export function CompetensSelection({
  selected,
  yearsOfExperience,
  onToggle,
  onYearsChange,
}: CompetensSelectionProps) {
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
          const isChecked = selected[comp.id];
          const yearsOfExperienceValue = yearsOfExperience[comp.id];

          return (
            <div
              key={comp.id}
              className="flex gap-2 flex-row items-center justify-center w-full max-w-md h-8"
            >
              <Field orientation="horizontal" className="flex-1">
                <Checkbox
                  id={comp.id}
                  name={comp.id}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    onToggle(comp.id, checked as boolean)
                  }
                  className="border border-black"
                />
                <FieldLabel
                  htmlFor={comp.id}
                  className="font-normal cursor-pointer"
                >
                  {comp.label}
                </FieldLabel>
              </Field>

              {isChecked && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Experience
                  </span>
                  <Input
                    onChange={(e) =>
                      onYearsChange(comp.id, Number(e.target.value))
                    }
                    value={yearsOfExperienceValue}
                    type="number"
                    name={`${comp.id}-years`}
                    step="0.25"
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
