
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  showCloseButton?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  size = "md",
  showCloseButton = true 
}: ModalProps) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${sizeClasses[size]} max-h-[90vh] overflow-y-auto bg-white shadow-2xl border-0`}>
        <DialogHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-sm text-gray-600">
                  {description}
                </DialogDescription>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>
        <div className="pt-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ModalFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  isLoading?: boolean;
  submitVariant?: "default" | "destructive";
}

export function ModalForm({ 
  children, 
  onSubmit, 
  submitText = "Salvar", 
  cancelText = "Cancelar",
  onCancel,
  isLoading = false,
  submitVariant = "default"
}: ModalFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        {children}
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6"
          >
            {cancelText}
          </Button>
        )}
        <Button
          type="submit"
          variant={submitVariant}
          disabled={isLoading}
          className="px-6"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Salvando...</span>
            </div>
          ) : (
            submitText
          )}
        </Button>
      </div>
    </form>
  );
}
