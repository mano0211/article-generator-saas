// 👇 ADD THIS LINE AT THE TOP!
// This forces Next.js to skip the static build for everything using this layout.
export const dynamic = 'force-dynamic';

import Shell from '../components/Shell' // Import Shell instead of Sidebar

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // The Shell handles the Sidebar state (isOpen/close) for you!
    <Shell>
      {children}
    </Shell>
  )
}