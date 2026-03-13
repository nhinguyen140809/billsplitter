import { cn } from "@/lib/utils";
import type { SectionStatus } from "@/types";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    title?: string;
    status?: SectionStatus;
    children: React.ReactNode;
}

export default function Section({
    title,
    status = "enabled",
    children,
    className,
    ...props
}: SectionProps) {
    return (
        <section
            className={cn(
                `w-full h-fit bg-card/30 border border-primary rounded-2xl p-5 flex flex-col sm:px-10 sm:py-10 backdrop-blur-md isolate ${status === "disabled" ? "opacity-50 pointer-events-none" : ""}`,
                className,
            )}
            {...props}
        >
            {title && (
                <h2 className="text-xl mt-1 sm:mt-0 sm:text-3xl font-extrabold text-primary mb-3 sm:mb-4">
                    {title}
                </h2>
            )}
            {children}
        </section>
    );
}
