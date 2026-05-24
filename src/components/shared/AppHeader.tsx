import { Github } from 'lucide-react'
import Section from './Section'
import { ModeToggle } from '../mode-toggle'
import { Separator } from '@/components/ui/separator'

function GithubButton() {
  return (
    <a
      href="https://github.com/nhinguyen140809/billsplitter"
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground/80 hover:text-muted-foreground/90 active:text-primary flex items-center text-sm font-medium transition md:text-base"
    >
      <Github className="mr-2 inline size-5" />
      View on GitHub
    </a>
  )
}

function AppHeader({ children }: { children?: React.ReactNode }) {
  return (
    <Section className="pb-3 text-center sm:pb-6">
      <h1 className="text-primary mt-2 text-3xl font-extrabold sm:mt-0 sm:text-4xl">
        Bill Splitter
      </h1>
      <div className="mt-4 flex flex-col-reverse items-center justify-center gap-4 sm:mt-6 sm:flex-row">
        <ModeToggle />
        <GithubButton />
      </div>
      <Separator className="mt-4 mb-3 sm:my-5" />
      {children}
    </Section>
  )
}

export default AppHeader
