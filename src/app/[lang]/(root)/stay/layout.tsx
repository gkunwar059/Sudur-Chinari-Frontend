export default function StayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1">{children}</div>
    </div>
  );
}
