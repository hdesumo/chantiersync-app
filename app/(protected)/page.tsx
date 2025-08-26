// app/(protected)/page.tsx
export default function DashboardPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Tableau de bord</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border p-4">Stat carte 1</div>
        <div className="rounded-2xl border p-4">Stat carte 2</div>
      </div>
    </section>
  );
}

