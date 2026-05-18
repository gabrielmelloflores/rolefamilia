import { BedDouble, ExternalLink, Coffee, UtensilsCrossed, Wine } from "lucide-react";

interface DayCardProps {
  day: {
    dayNumber: number;
    title: string;
    description?: string | null;
    accommodation?: string | null;
    accommodationUrl?: string | null;
    meals: string[];
    activities?: Array<{ name: string; description?: string; duration?: string; isOptional?: boolean }> | null;
  };
}

const MEAL_ICONS: Record<string, React.ReactNode> = {
  CAFE_DA_MANHA: <Coffee className="h-4 w-4" />,
  ALMOCO: <UtensilsCrossed className="h-4 w-4" />,
  JANTAR: <Wine className="h-4 w-4" />,
};
const MEAL_LABELS: Record<string, string> = {
  CAFE_DA_MANHA: "Café da manhã",
  ALMOCO: "Almoço",
  JANTAR: "Jantar",
};

export function DayCard({ day }: DayCardProps) {
  return (
    <div className="flex gap-5">
      <div className="flex-none">
        <div className="h-12 w-12 rounded-full bg-amber-500 text-stone-900 flex items-center justify-center font-bold text-lg leading-none">
          {String(day.dayNumber).padStart(2, "0")}
        </div>
      </div>
      <div className="flex-1 pb-10 border-l border-stone-200 pl-6 -ml-0.5">
        <h3 className="font-heading text-xl font-bold text-stone-900 mb-3">
          Dia {day.dayNumber}: {day.title}
        </h3>

        {day.description && (
          <p className="text-stone-600 leading-relaxed mb-5">{typeof day.description === "string" ? day.description : ""}</p>
        )}

        {day.meals && day.meals.length > 0 && (
          <div className="flex gap-3 mb-4">
            {day.meals.map((meal) => (
              <span key={meal} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-stone-100 rounded-full text-stone-600">
                {MEAL_ICONS[meal]} {MEAL_LABELS[meal]}
              </span>
            ))}
          </div>
        )}

        {day.accommodation && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
            <BedDouble className="h-4 w-4 text-blue-600 flex-none" />
            <span className="text-sm text-stone-700 font-medium">{day.accommodation}</span>
            {day.accommodationUrl && (
              <a
                href={day.accommodationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                Reservar <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {day.activities && day.activities.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Atividades</p>
            {day.activities.map((act, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-none mt-0.5">✓</span>
                <div>
                  <span className="text-sm font-medium text-stone-800">{act.name}</span>
                  {act.duration && <span className="text-xs text-stone-400 ml-2">({act.duration})</span>}
                  {act.isOptional && <span className="text-xs text-amber-600 ml-2 font-medium">Opcional</span>}
                  {act.description && <p className="text-sm text-stone-500 mt-0.5">{act.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
