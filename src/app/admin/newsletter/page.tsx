import { prisma } from "@/lib/prisma";
import { NewsletterTable } from "./NewsletterTable";

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
      <NewsletterTable subscribers={subscribers} />
    </div>
  );
}
