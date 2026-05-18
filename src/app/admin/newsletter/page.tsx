import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  const confirmed = subscribers.filter((s) => s.confirmedAt).length;
  const unsubscribed = subscribers.filter((s) => s.unsubscribedAt).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Newsletter</h2>
        <p className="text-sm text-stone-500">
          {subscribers.length} inscritos — {confirmed} confirmados — {unsubscribed} descadastrados
        </p>
      </div>

      <DataTable
        data={subscribers}
        searchKeys={["email", "name"]}
        columns={[
          {
            key: "email",
            header: "Email",
            render: (_, row) => (
              <div>
                <p className="font-medium text-sm">{row.email}</p>
                {row.name && <p className="text-xs text-stone-400">{row.name}</p>}
              </div>
            ),
          },
          {
            key: "source",
            header: "Origem",
            render: (value) => (
              <span className="text-xs px-2 py-1 bg-stone-100 rounded-full text-stone-600">
                {(value as string) ?? "desconhecida"}
              </span>
            ),
          },
          {
            key: "confirmedAt",
            header: "Status",
            render: (_, row) => {
              if (row.unsubscribedAt) {
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Descadastrado</Badge>;
              }
              if (row.confirmedAt) {
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmado</Badge>;
              }
              return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
            },
          },
          {
            key: "createdAt",
            header: "Inscrito em",
            render: (value) => <span className="text-xs text-stone-400">{formatDate(value as Date)}</span>,
          },
        ]}
      />
    </div>
  );
}
