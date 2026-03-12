import { cn } from "@/lib/utils";


export default function Overlay({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const classname = cn("fixed top-0 left-0 w-screen h-screen bg-card/70 flex items-center justify-center z-50 px-4 sm:px-0 transition-opacity backdrop-blur-xl animate-in fade-in duration-200", className);
    return (
        <div
            className={classname}
        >
            {children}
        </div>
    );
}
