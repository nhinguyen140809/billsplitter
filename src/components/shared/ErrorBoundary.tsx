import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { db } from '@/db/dexie'

type Props = { children: ReactNode }
type State = { hasError: boolean; error: Error | null }

const buildIssueUrl = (error: Error) => {
  const title = encodeURIComponent(`Bug: ${error.message}`)
  const body = encodeURIComponent(
    `**Error:** ${error.message}\n\n**Stack:**\n\`\`\`\n${error.stack ?? 'unavailable'}\n\`\`\`\n\n**Browser:** ${navigator.userAgent}\n\n**Steps to reproduce:**\n\n1. `
  )
  return `https://github.com/nhinguyen140809/BillSplitting/issues/new?title=${title}&body=${body}`
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  private resetAndReload = async () => {
    await db.delete()
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const { error } = this.state
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
        <p className="text-2xl font-bold">Something went wrong</p>
        {error && (
          <p className="text-muted-foreground max-w-md break-all font-mono text-sm">
            {error.message}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Try refreshing</Button>
          {error && (
            <Button variant="outline" onClick={() => window.open(buildIssueUrl(error), '_blank')}>
              Report issue
            </Button>
          )}
          <Button variant="destructive" onClick={this.resetAndReload}>
            Reset app data
          </Button>
        </div>
      </div>
    )
  }
}
