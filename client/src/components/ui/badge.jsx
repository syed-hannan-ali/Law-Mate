import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@components/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",

                urgent: "bg-red-600 text-white",
                high: "bg-orange-500 text-white",
                medium: "bg-yellow-400 text-black",
                low: "bg-green-400 text-black",

                pending: "bg-slate-400 text-white",
                "in-progress": "bg-blue-500 text-white",
                completed: "bg-emerald-500 text-white",
                cancelled: "bg-zinc-700 text-white/70",

                green: "bg-green-100 text-green-800 border border-green-300",
                blue: "bg-blue-100 text-blue-800 border border-blue-300",
                red: "bg-red-100 text-red-800 border border-red-300",
                yellow: "bg-yellow-100 text-yellow-800 border border-yellow-300",
                indigo: "bg-indigo-100 text-indigo-800 border border-indigo-300",
                purple: "bg-purple-100 text-purple-800 border border-purple-300",
                pink: "bg-pink-100 text-pink-800 border border-pink-300",
                gray: "bg-gray-100 text-gray-800 border border-gray-300",
                orange: "bg-orange-100 text-orange-800 border border-orange-300",
                teal: "bg-teal-100 text-teal-800 border border-teal-300",
                cyan: "bg-cyan-100 text-cyan-800 border border-cyan-300",
                lime: "bg-lime-100 text-lime-800 border border-lime-300",
                rose: "bg-rose-100 text-rose-800 border border-rose-300",
                sky: "bg-sky-100 text-sky-800 border border-sky-300",
                amber: "bg-amber-100 text-amber-800 border border-amber-300",
                
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

function Badge({ className, variant, ...props }) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
