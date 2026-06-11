import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell min-h-screen bg-slate-100">
      
      {/* top nav gone brr */}
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col lg:flex-row">
        
        {/* side nav actually gone now */}
        <div className="print:hidden">
          <Sidebar />
        </div>

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-0 lg:pl-72">
          <div className="page-container w-full px-4 py-4 md:px-8 md:py-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}