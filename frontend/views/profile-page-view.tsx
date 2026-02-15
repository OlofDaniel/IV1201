interface ProfilePageViewProps {
  username: string | null;
  first_name: string | null;
  surname: string | null;
  email: string | null;
  person_number: string | null;
  errorMessage: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export function ProfilePageView({
  username,
  first_name,
  surname,
  email,
  person_number,
  errorMessage,
  isAuthenticated,
  loading,
}: ProfilePageViewProps) {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Välkommen {first_name} {surname}
      </h1>

      <div className="grid grid-cols-2 gap-y-4 border-t pt-4">
        <span className="font-bold">Användarnamn:</span> <span>{username}</span>
        <span className="font-bold">Förnamn:</span> <span>{first_name}</span>
        <span className="font-bold">Efternamn:</span> <span>{surname}</span>
        <span className="font-bold">Email:</span> <span>{email}</span>
        <span className="font-bold">Personnummer:</span>
        {person_number}
      </div>

      <div className="mt-8 pt-4 border-t text-xl font-semibold">
        Ansökningar
      </div>
    </div>
  );
}
