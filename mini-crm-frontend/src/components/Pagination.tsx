import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  hasMore: boolean;
  onPageChange: (newPage: number) => void;
}

export function Pagination({ page, hasMore, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-8 py-4 bg-slate-50/50 border-t border-slate-100">
      <span className="text-sm text-slate-500 font-medium">
        Página <span className="text-slate-900">{page}</span>
      </span>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="h-9 w-9 p-0"
        >
          <ChevronLeft size={18} />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={!hasMore}
          onClick={() => onPageChange(page + 1)}
          className="h-9 w-9 p-0"
        >
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}