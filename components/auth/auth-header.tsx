interface AuthHeaderProps {
  label: string;
  title: string;
}

export const AuthHeader = ({label, title}: AuthHeaderProps) => {
  return (
    <div className="flex flex-col gap-y-4 items-center">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}