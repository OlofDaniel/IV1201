import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface applicationCardProps {
  competencies: Record<string, number | null>;
  availability: Array<{ from_date: string; to_date: string }>;
  status: string;
}

export function ApplicationCard({
  competencies,
  availability,
  status,
}: applicationCardProps) {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Application status: {status}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Competencies</h3>
            {Object.entries(competencies).map(([key, value]) => (
              <p key={key}>
                {key}: {value ?? "Not selected"} years
              </p>
            ))}
          </div>
          <div>
            <h3 className="font-semibold">Availability</h3>
            {availability.map((range, idx) => (
              <p key={idx}>
                {range.from_date} to {range.to_date}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
