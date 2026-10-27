import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"a"> & VariantProps<typeof buttonVariants>;

/** Anchor styled as a shadcn Button (base-ui Button has no `asChild`). */
export function LinkButton({ className, variant, size, ...props }: Props) {
  return <a className={cn(buttonVariants({ variant, size }), "cursor-pointer", className)} {...props} />;
}
