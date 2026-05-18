import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Sobre Nós — Rolê Família",
  description: "Conheça a família por trás do canal Rolê Família.",
};

export default function SobrePage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <Breadcrumb items={[{ label: "Sobre nós" }]} />
          <h1 className="font-heading text-4xl sm:text-5xl text-stone-900 mt-4 mb-6">Sobre o Rolê Família</h1>
        </div>

        <div className="prose prose-stone prose-lg max-w-none">
          <p>
            Olá! Somos uma família apaixonada por viagens que decidiu documentar cada aventura para inspirar outras
            famílias a explorar o Brasil e o mundo. Nosso canal no YouTube nasceu do desejo de mostrar que viajar em
            família não só é possível, como é incrível!
          </p>
          <p>
            Por aqui você encontra roteiros detalhados, dicas honestas, recomendações de hospedagem e muito mais.
            Também criamos produtos digitais — e-books e mapas — que vão te ajudar a planejar a viagem perfeita.
          </p>
          <h2>Nossa missão</h2>
          <p>
            Inspirar famílias brasileiras a viajar mais, com mais planejamento e menos estresse. Acreditamos que as
            melhores memórias são criadas em viagem, e queremos fazer parte da sua história.
          </p>
          <h2>Entre em contato</h2>
          <p>
            Tem alguma dúvida, sugestão ou quer fazer uma parceria?{" "}
            <a href="/contato">Fale conosco!</a>
          </p>
        </div>
      </div>
    </div>
  );
}
