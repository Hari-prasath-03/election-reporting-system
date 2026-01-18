import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

interface FormInputProps extends ComponentProps<"input"> {
  label: string;
  name: string;
  error?: string | string[];
  containerClassName?: string;
}

export function FormInput({
  label,
  name,
  error,
  containerClassName,
  className,
  id,
  ...props
}: FormInputProps) {
  const inputId = id || name;

  return (
    <div className={cn("grid gap-2", containerClassName)}>
      <Label htmlFor={inputId}>{label}</Label>
      <Input id={inputId} name={name} className={className} {...props} />
      {error && (
        <p className="text-sm text-destructive">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}
