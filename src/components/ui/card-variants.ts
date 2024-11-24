import { cva } from 'class-variance-authority';

export const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "p-6",
        compact: "p-4",
        flat: "border-none shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
); 