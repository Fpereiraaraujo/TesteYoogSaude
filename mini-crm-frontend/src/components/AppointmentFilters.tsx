import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

export function AppointmentFilters({ 
  search, 
  onSearchChange, 
  statusFilter, 
  onStatusChange, 
  onClear 
}: FiltersProps) {
  const hasFilters = search !== "" || statusFilter !== "all";

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input 
          placeholder="Buscar por nome ou descrição..." 
          className="pl-10 h-11 bg-slate-50/50 border-none focus-visible:ring-blue-500"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 w-full md:w-auto">
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="h-11 w-full md:w-[180px] bg-slate-50/50 border-none">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="WAITING">Aguardando</SelectItem>
            <SelectItem value="IN_PROGRESS">Em Atendimento</SelectItem>
            <SelectItem value="FINISHED">Finalizados</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" onClick={onClear} className="h-11 px-3 text-slate-400 hover:text-red-500">
            <X size={20} />
          </Button>
        )}
      </div>
    </div>
  );
}