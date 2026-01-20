import { ReactNode } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "number" | "password" | "url" | "date" | "time" | "datetime-local";
  required?: boolean;
  error?: FieldError | string;
  register?: UseFormRegisterReturn;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  helpText?: string;
  autoFocus?: boolean;
}

interface TextareaFieldProps extends Omit<FormFieldProps, "type"> {
  rows?: number;
}

export function FormField({
  id,
  label,
  placeholder,
  type = "text",
  required = false,
  error,
  register,
  className,
  inputClassName,
  labelClassName,
  fullWidth = false,
  disabled = false,
  helpText,
  autoFocus = false,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", fullWidth && "md:col-span-2", className)}>
      <Label 
        htmlFor={id} 
        className={cn("text-sm font-medium text-gray-700", labelClassName)}
      >
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={cn(
          "h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500",
          inputClassName
        )}
        {...register}
      />
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="text-sm text-red-600">
          {typeof error === "string" ? error : error.message}
        </p>
      )}
    </div>
  );
}

export function TextareaField({
  id,
  label,
  placeholder,
  required = false,
  error,
  register,
  className,
  inputClassName,
  labelClassName,
  fullWidth = false,
  disabled = false,
  helpText,
  autoFocus = false,
  rows = 4,
}: TextareaFieldProps) {
  return (
    <div className={cn("space-y-1.5", fullWidth && "md:col-span-2", className)}>
      <Label 
        htmlFor={id} 
        className={cn("text-sm font-medium text-gray-700", labelClassName)}
      >
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        rows={rows}
        className={cn(
          "border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none",
          inputClassName
        )}
        {...register}
      />
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="text-sm text-red-600">
          {typeof error === "string" ? error : error.message}
        </p>
      )}
    </div>
  );
}
