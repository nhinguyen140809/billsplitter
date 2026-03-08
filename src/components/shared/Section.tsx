import { cn } from "@/lib/utils";
import type { SectionStatus } from "@/types";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    title?: string;
    status?: SectionStatus;
    children: React.ReactNode;
}

export function Section({
    title,
    status = "enabled",
    children,
    className,
    ...props
}: SectionProps) {
    return (
        <section
            className={cn(
                `w-full h-fit bg-background/20 border border-primary rounded-2xl p-4 py-6 flex flex-col sm:px-10 sm:py-10 backdrop-blur-md isolate ${status === "disabled" ? "opacity-50 pointer-events-none" : ""}`,
                className,
            )}
            {...props}
        >
            {title && (
                <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-4">
                    {title}
                </h2>
            )}
            {children}
        </section>
    );
}
