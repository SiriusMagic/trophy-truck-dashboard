import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
// Importamos 'type VariantProps' para obtener los tipos de las variantes de cva
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils" // Asume que tienes un archivo de utilidades 'cn'

// Definición de las variantes CSS con cva
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
              variant: {
                      default:
                                "bg-primary text-primary-foreground shadow hover:bg-primary/90",
                                        destructive:
                                                  "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                                                          outline:
                                                                    "border border-input shadow-sm hover:bg-accent hover:text-accent-foreground",
                                                                            secondary:
                                                                                      "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                                                                                              ghost: "hover:bg-accent hover:text-accent-foreground",
                                                                                                      link: "text-primary underline-offset-4 hover:underline",
                                                                                                            },
                                                                                                                  size: {
                                                                                                                          default: "h-9 px-4 py-2",
                                                                                                                                  sm: "h-8 rounded-md px-3 text-xs",
                                                                                                                                          lg: "h-10 rounded-md px-8",
                                                                                                                                                  icon: "h-9 w-9",
                                                                                                                                                        },
                                                                                                                                                            },
                                                                                                                                                                defaultVariants: {
                                                                                                                                                                      variant: "default",
                                                                                                                                                                            size: "default",
                                                                                                                                                                                },
                                                                                                                                                                                  }
                                                                                                                                                                                  )

                                                                                                                                                                                  // Definición de los tipos para las props del componente Button
                                                                                                                                                                                  export interface ButtonProps
                                                                                                                                                                                    // 1. Incluye las props nativas de un botón HTML
                                                                                                                                                                                      extends React.ButtonHTMLAttributes<HTMLButtonElement>, 
                                                                                                                                                                                        // 2. Incluye los tipos de las variantes ('variant' y 'size')
                                                                                                                                                                                            VariantProps<typeof buttonVariants> { 
                                                                                                                                                                                              // 3. Incluye la prop específica para @radix-ui/react-slot
                                                                                                                                                                                                asChild?: boolean
                                                                                                                                                                                                }

                                                                                                                                                                                                // Componente Button con tipado y reenvío de referencia (forwardRef)
                                                                                                                                                                                                const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
                                                                                                                                                                                                  ({ className, variant, size, asChild = false, ...props }, ref) => {
                                                                                                                                                                                                      // Determina si renderiza la ranura (Slot) o un elemento 'button'
                                                                                                                                                                                                          const Comp = asChild ? Slot : "button"
                                                                                                                                                                                                              return (
                                                                                                                                                                                                                    <Comp
                                                                                                                                                                                                                            // Combina las clases de variantes con cualquier clase adicional
                                                                                                                                                                                                                                    className={cn(buttonVariants({ variant, size, className }))}
                                                                                                                                                                                                                                            ref={ref}
                                                                                                                                                                                                                                                    {...props}
                                                                                                                                                                                                                                                          />
                                                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                Button.displayName = "Button"

                                                                                                                                                                                                                                                                export { Button, buttonVariants }