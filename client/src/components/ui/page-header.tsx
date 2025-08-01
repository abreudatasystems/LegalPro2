
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  stats?: Array<{ label: string; value: string | number; variant?: 'default' | 'success' | 'warning' | 'error' }>;
  onBack?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
  actions,
  stats,
  onBack,
  onRefresh,
  isLoading = false
}: PageHeaderProps) {
  const getStatVariant = (variant: string = 'default') => {
    const variants = {
      default: "bg-blue-100 text-blue-800",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800"
    };
    return variants[variant as keyof typeof variants] || variants.default;
  };

  return (
    <Card className="legal-card shadow-sm border-0 border-b border-gray-100 rounded-none">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Breadcrumb */}
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                {breadcrumb.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    {item.href ? (
                      <a href={item.href} className="hover:text-blue-600 transition-colors">
                        {item.label}
                      </a>
                    ) : (
                      <span className={index === breadcrumb.length - 1 ? "text-gray-900 font-medium" : ""}>
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Header content */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {onBack && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="mt-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-gray-600 max-w-2xl">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              )}
              {actions}
            </div>
          </div>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {stats.map((stat, index) => (
                <Badge key={index} className={getStatVariant(stat.variant)}>
                  {stat.label}: {stat.value}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
