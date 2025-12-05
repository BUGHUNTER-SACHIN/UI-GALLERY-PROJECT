import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
const Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ React.createElement(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary/50", className),
    ...props
  },
  /* @__PURE__ */ React.createElement(
    ProgressPrimitive.Indicator,
    {
      className: "h-full w-full flex-1 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out",
      style: { transform: `translateX(-${100 - (value || 0)}%)` }
    }
  )
));
Progress.displayName = ProgressPrimitive.Root.displayName;
export { Progress };
