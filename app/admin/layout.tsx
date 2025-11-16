export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is for all admin routes
  // Auth protection is handled by middleware and route group layouts
  return <>{children}</>;
}

