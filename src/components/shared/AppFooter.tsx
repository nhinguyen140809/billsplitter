import FeedbackButton from './FeedbackButton'

export default function AppFooter() {
  return (
    <footer className="text-muted-foreground mt-4 flex items-center justify-center gap-2 border-none text-xs sm:text-sm">
      <span>© 2026 YenNhi | v2.0 | All data stored locally in your browser</span>
      <FeedbackButton />
    </footer>
  )
}
