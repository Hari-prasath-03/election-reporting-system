import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label?: string;
  name?: string;
  options: FormSelectOption[];
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string | string[];
  containerClassName?: string;
  required?: boolean;
}

export function FormSelect({
  label,
  name,
  options,
  placeholder = "Select option",
  defaultValue,
  value,
  onValueChange,
  error,
  containerClassName,
  required,
}: FormSelectProps) {
  return (
    <div className={cn("grid gap-2", containerClassName)}>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Select
        name={name}
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
        required={required}
      >
        <SelectTrigger id={name}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-destructive">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}
