type Props = {
  loading?: boolean;
  error?: string | null;
  empty?: string | null;
  info?: string | null;
};

export function StatusLine({ loading, error, empty, info }: Props) {
  if (loading) {
    return (
      <p className="text-sm text-muted-foreground" role="status" aria-busy="true">
        Ładowanie…
      </p>
    );
  }
  if (error) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {error}
      </p>
    );
  }
  if (empty) {
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  }
  if (info) {
    return <p className="text-sm text-muted-foreground">{info}</p>;
  }
  return null;
}