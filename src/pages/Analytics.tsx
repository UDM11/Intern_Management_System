export const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">View intern management analytics and reports</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Total Interns</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Active Interns</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Completed</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
};