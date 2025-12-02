import { AdminPanel } from "@/components/admin-panel"

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <div className="max-w-2xl">
          <AdminPanel />
        </div>
      </div>
    </main>
  )
}
