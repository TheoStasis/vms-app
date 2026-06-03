export default function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="block w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <table className="min-w-full whitespace-nowrap border-separate border-spacing-0 text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-slate-900">
          <tr>{headers.map((h, i) => <th key={i} className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100 [&>tr]:transition-colors [&>tr:hover]:bg-slate-50/80">{children}</tbody>
      </table>
    </div>
  );
}