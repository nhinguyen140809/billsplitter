import './App.css'
import { ThemeProvider } from '@/components/theme-provider'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'

const AppRoutesWrapper = () => {
  const routes = useRoutes(AppRoutes)
  return routes
}

function App() {
  return (
    <div className="bg-background dark:from-background/95 to-accent/30 animated-gradient flex min-h-screen justify-center bg-gradient-to-bl bg-[length:200%_200%]">
      <div className="flex w-full max-w-4xl flex-col gap-4 px-3 py-8 sm:gap-8 sm:py-8 lg:px-0">
        <ThemeProvider>
          <BrowserRouter basename="/billsplitter">
            <AppRoutesWrapper />
          </BrowserRouter>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default App
