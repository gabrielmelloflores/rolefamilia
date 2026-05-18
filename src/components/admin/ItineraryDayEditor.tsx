"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DayData {
  id: string;
  title: string;
  accommodation: string;
  accommodationUrl: string;
  meals: string[];
  description: string;
  activities?: Array<{ name: string; description?: string; duration?: string; isOptional?: boolean }>;
}

interface SortableDayProps {
  day: DayData;
  index: number;
  onUpdate: (id: string, field: string, value: unknown) => void;
  onRemove: (id: string) => void;
}

function SortableDay({ day, index, onUpdate, onRemove }: SortableDayProps) {
  const [open, setOpen] = useState(index === 0);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: day.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const toggleMeal = (meal: string) => {
    const meals = day.meals.includes(meal)
      ? day.meals.filter((m) => m !== meal)
      : [...day.meals, meal];
    onUpdate(day.id, "meals", meals);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-stone-200 rounded-xl bg-white overflow-hidden"
    >
      <div className="flex items-center gap-3 p-4 bg-stone-50">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-stone-400 hover:text-stone-600"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
            Dia {index + 1}
          </span>
          <p className="text-sm font-medium text-stone-700 truncate">
            {day.title || "Sem título"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-stone-400 hover:text-stone-600"
        >
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => onRemove(day.id)}
          className="text-red-400 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Título do dia</Label>
            <Input
              value={day.title}
              onChange={(e) => onUpdate(day.id, "title", e.target.value)}
              placeholder="Ex: Chegada em Lisboa"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Descrição</Label>
            <textarea
              value={day.description}
              onChange={(e) => onUpdate(day.id, "description", e.target.value)}
              placeholder="Descreva as atividades do dia..."
              className="w-full border border-stone-200 rounded-lg p-3 text-sm resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Hospedagem</Label>
              <Input
                value={day.accommodation}
                onChange={(e) => onUpdate(day.id, "accommodation", e.target.value)}
                placeholder="Nome do hotel/hostel"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Link Booking.com</Label>
              <Input
                value={day.accommodationUrl}
                onChange={(e) => onUpdate(day.id, "accommodationUrl", e.target.value)}
                placeholder="https://booking.com/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Refeições inclusas</Label>
            <div className="flex gap-4">
              {[
                { value: "CAFE_DA_MANHA", label: "☕ Café da manhã" },
                { value: "ALMOCO", label: "🍽 Almoço" },
                { value: "JANTAR", label: "🍷 Jantar" },
              ].map(({ value, label }) => (
                <div key={value} className="flex items-center gap-2">
                  <Checkbox
                    id={`${day.id}-${value}`}
                    checked={day.meals.includes(value)}
                    onCheckedChange={() => toggleMeal(value)}
                  />
                  <label
                    htmlFor={`${day.id}-${value}`}
                    className="text-sm cursor-pointer"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ItineraryDayEditorProps {
  days: DayData[];
  onChange: (days: DayData[]) => void;
}

export function ItineraryDayEditor({ days, onChange }: ItineraryDayEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = days.findIndex((d) => d.id === active.id);
      const newIndex = days.findIndex((d) => d.id === over?.id);
      onChange(arrayMove(days, oldIndex, newIndex));
    }
  }

  function addDay() {
    const newDay: DayData = {
      id: `day-${Date.now()}`,
      title: "",
      accommodation: "",
      accommodationUrl: "",
      meals: [],
      description: "",
    };
    onChange([...days, newDay]);
  }

  function updateDay(id: string, field: string, value: unknown) {
    onChange(days.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  }

  function removeDay(id: string) {
    onChange(days.filter((d) => d.id !== id));
  }

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={days.map((d) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {days.map((day, index) => (
            <SortableDay
              key={day.id}
              day={day}
              index={index}
              onUpdate={updateDay}
              onRemove={removeDay}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="outline"
        onClick={addDay}
        className="w-full border-dashed border-2 border-stone-300 hover:border-amber-400 hover:text-amber-600"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar dia
      </Button>
    </div>
  );
}
