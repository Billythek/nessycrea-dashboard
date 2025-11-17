import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AnimatedGradientBg } from '@/components/magic'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <div className="relative flex h-screen overflow-hidden">
        {/* Animated Background */}
        <AnimatedGradientBg variant="subtle" />

        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="relative z-10 flex flex-1 flex-col overflow-hidden lg:ml-64">
          <Header />

          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-3 sm:p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}
