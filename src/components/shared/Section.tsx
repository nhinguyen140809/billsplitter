import { cn } from '@/lib/utils'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  children: React.ReactNode
}

export default function Section({ title, children, className, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        'bg-card/30 border-primary isolate flex h-fit w-full flex-col rounded-2xl border p-5 backdrop-blur-md sm:px-10 sm:py-10',
        className
      )}
      {...props}
    >
      {title && (
        <h2 className="text-primary mt-1 mb-3 text-xl font-extrabold sm:mt-0 sm:mb-4 sm:text-3xl">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
