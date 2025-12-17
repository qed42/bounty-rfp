import Link from "next/link"

export function Sidebar() {
  return (
    <aside
      className="w-64 shrink-0 border-r border-gray-200 dark:border-gray-800
      bg-white dark:bg-black"
    >
      <div className="p-6">
        <h1 className="text-lg font-semibold tracking-tight">
          RFP Dashboard
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Presales Workspace
        </p>
      </div>

      <nav className="px-3 space-y-1">
        <SidebarLink href="/dashboard" label="Dashboard" />
        <SidebarLink href="/reports" label="Reports" />
        <SidebarLink href="/settings" label="Settings" />
      </nav>
    </aside>
  )
}

function SidebarLink({
  href,
  label,
}: {
  href: string
  label: string
}) {
  return (
    <Link
      href={href}
      className="block rounded-md px-3 py-2 text-sm font-medium
        text-gray-700 hover:bg-gray-100 hover:text-black
        dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white
        transition-colors"
    >
      {label}
    </Link>
  )
}
