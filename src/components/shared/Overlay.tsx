import { cn } from '@/lib/utils'

export default function Overlay({ children, className, ...props }: React.ComponentProps<'div'>) {
  const classname = cn(
    'fixed top-0 left-0 w-screen h-screen bg-card/50 flex items-center justify-center z-50 px-3 sm:px-0 transition-opacity backdrop-blur-xl animate-in fade-in duration-200',
    className
  )
  return (
    <div className={classname} {...props}>
      {children}
    </div>
  )
}
