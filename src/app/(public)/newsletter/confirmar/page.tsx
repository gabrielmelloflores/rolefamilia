import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ConfirmarNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <ErrorPage message="Token inválido." />;
  }

  const subscriber = await prisma.subscriber.findUnique({ where: { confirmToken: token } });

  if (!subscriber) {
    return <ErrorPage message="Token não encontrado ou já utilizado." />;
  }

  if (subscriber.confirmedAt) {
    return <SuccessPage name={subscriber.name} alreadyDone />;
  }

  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: { confirmedAt: new Date(), confirmToken: null },
  });

  return <SuccessPage name={subscriber.name} />;
}

function SuccessPage({ name, alreadyDone }: { name?: string | null; alreadyDone?: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-md text-center space-y-5">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="font-heading text-3xl text-stone-900 font-bold">
          {alreadyDone ? "Já confirmado!" : "Inscrição confirmada!"}
        </h1>
        <p className="text-stone-500">
          {name ? `Olá, ${name}! ` : ""}
          {alreadyDone
            ? "Sua newsletter já estava ativa. Obrigado!"
            : "Bem-vindo à nossa newsletter! Você vai receber nossas melhores dicas de viagem toda semana."}
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-full bg-amber-500 text-stone-900 font-bold hover:bg-amber-400 transition-colors"
        >
          Explorar o site
        </Link>
      </div>
    </div>
  );
}

function ErrorPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-md text-center space-y-5">
        <XCircle className="h-16 w-16 text-red-400 mx-auto" />
        <h1 className="font-heading text-3xl text-stone-900 font-bold">Ops!</h1>
        <p className="text-stone-500">{message}</p>
        <Link href="/" className="inline-block px-8 py-3 rounded-full bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
