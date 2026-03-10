export default function Popup({
    children,
    title,
    className,
}: {
    children: React.ReactNode;
    title: string;
    className?: string;
}) {
    return (
        <div className={`w-full h-fit max-h-4xl max-w-lg bg-card/20 border border-border rounded-2xl p-4 py-6 flex flex-col sm:px-10 sm:py-10 px-6 backdrop-blur-xl ${className || ''}`}>
            <h2 className="text-2xl font-extrabold text-primary mb-4">
                {title}
            </h2>
            {children}
        </div>
    );
}
