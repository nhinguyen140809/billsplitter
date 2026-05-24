import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const APP_VERSION = 'v2.0'
const ISSUES_URL = 'https://github.com/nhinguyen140809/BillSplitting/issues/new'

const BUG_REPORT_URL =
  ISSUES_URL +
  '?title=' +
  encodeURIComponent('Bug report: ') +
  '&body=' +
  encodeURIComponent(
    '**Steps to reproduce:**\n\n1. \n\n**Expected:**\n\n**Actual:**\n\n**App version:** ' +
      APP_VERSION
  )

const copyDebugInfo = async () => {
  const info = [
    `App version: ${APP_VERSION}`,
    `URL: ${window.location.href}`,
    `Browser: ${navigator.userAgent}`,
    `Date: ${new Date().toISOString()}`,
  ].join('\n')
  await navigator.clipboard.writeText(info)
}

export default function FeedbackButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Send feedback">
          <MessageCircle />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          <Button variant="outline" onClick={() => window.open(BUG_REPORT_URL, '_blank')}>
            Report a bug
          </Button>
          <Button variant="ghost" onClick={copyDebugInfo}>
            Copy debug info to clipboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
