"use client";

import { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronLeft, ChevronRight, Search } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface Action<T> {
  label: string;
  onClick: (row: T) => void;
  variant?: "default" | "destructive";
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  searchable?: boolean;
  searchKeys?: string[];
  pageSize?: number;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  actions = [],
  searchable = true,
  searchKeys = ["title", "name", "email"],
  pageSize = 15,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useCallback(() => {
    if (!search) return data;
    return data.filter((row) =>
      searchKeys.some((key) => {
        const val = (row as Record<string, unknown>)[key];
        return String(val ?? "").toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [data, search, searchKeys]);

  const filteredData = filtered();
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginated = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
      )}

      <div className="rounded-xl border border-stone-200 overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50">
              {columns.map((col) => (
                <TableHead key={col.key} className="font-semibold text-stone-600">
                  {col.header}
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="w-16 text-right">Ações</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="text-center py-12 text-stone-400"
                >
                  Nenhum resultado encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row) => (
                <TableRow key={row.id} className="hover:bg-stone-50 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render((row as Record<string, unknown>)[col.key], row)
                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-stone-100 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.map((action) => (
                            <DropdownMenuItem
                              key={action.label}
                              onClick={() => action.onClick(row)}
                              className={
                                action.variant === "destructive"
                                  ? "text-red-600 cursor-pointer"
                                  : "cursor-pointer"
                              }
                            >
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-500">
            {filteredData.length} itens · Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
