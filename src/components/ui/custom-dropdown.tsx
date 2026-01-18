import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface DropdownItem {
  label: string;
  onClick?: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

interface CustomDropdownProps {
  trigger?: ReactNode;
  label?: string;
  items: (DropdownItem | "separator")[];
  align?: "start" | "end" | "center";
}

export function CustomDropdown({
  trigger,
  label,
  items,
  align = "end",
}: CustomDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
        {items.map((item, index) => {
          if (item === "separator") {
            return <DropdownMenuSeparator key={`sep-${index}`} />;
          }
          return (
            <DropdownMenuItem
              key={index}
              onClick={item.onClick}
              disabled={item.disabled}
              className={cn(
                item.variant === "destructive" &&
                "text-red-600 focus:text-red-600"
              )}
            >
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
