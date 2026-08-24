import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../_lib/cn';

const badge = cva(
  'inline-flex shrink-0 items-center rounded-control px-xs py-xxs text-caption font-semibold',
  {
    variants: {
      tone: {
        neutral: '',
        info: '',
        success: '',
        warning: '',
        danger: '',
      },
      variant: {
        plein: '',
        contour: 'border bg-bg',
      },
    },
    compoundVariants: [
      { tone: 'neutral', variant: 'plein', class: 'bg-bg-muted text-text-muted' },
      { tone: 'info', variant: 'plein', class: 'bg-blue-50 text-blue-700' },
      { tone: 'success', variant: 'plein', class: 'bg-success-bg text-success' },
      { tone: 'warning', variant: 'plein', class: 'bg-orange-50 text-orange-700' },
      { tone: 'danger', variant: 'plein', class: 'bg-danger-bg text-danger' },
      { tone: 'neutral', variant: 'contour', class: 'border-border text-text-muted' },
      { tone: 'info', variant: 'contour', class: 'border-blue-200 text-blue-700' },
      { tone: 'success', variant: 'contour', class: 'border-green-200 text-success' },
      { tone: 'warning', variant: 'contour', class: 'border-orange-200 text-orange-700' },
      { tone: 'danger', variant: 'contour', class: 'border-red-200 text-danger' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'plein' },
  },
);

export interface BadgeProps
  extends React.ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof badge> {}

export function Badge({ tone, variant, className, ...props }: BadgeProps) {
  return <span className={cn(badge({ tone, variant }), className)} {...props} />;
}
