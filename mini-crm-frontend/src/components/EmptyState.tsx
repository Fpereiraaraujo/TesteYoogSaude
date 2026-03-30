import { TableCell, TableRow } from "@/components/ui/table";

export function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={3} className="text-center py-24 text-slate-400 font-medium italic">
        Nenhum atendimento em aberto no momento.
      </TableCell>
    </TableRow>
  );
}