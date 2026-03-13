import { cn } from "@/lib/utils";

export default function Popup({
    children,
    title,
    className,
}: {
    children: React.ReactNode;
    title: string;
    className?: string;
}) {
    const classname = cn(
        "w-full h-fit max-h-4xl max-w-lg bg-card/20 border border-border rounded-2xl p-6 flex flex-col sm:px-10 sm:py-10 backdrop-blur-xl animate-in zoom-in-95 duration-200",
        className,
    );
    return (
        <div className={classname}>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary mb-2 sm:mb-4">
                {title}
            </h2>
            {children}
        </div>
    );
}
