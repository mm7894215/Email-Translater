declare module 'next-themes' {
  export interface ThemeProviderProps {
    attribute?: string
    defaultTheme?: string
    children?: React.ReactNode
    value?: {
      light?: string
      dark?: string
      system?: string
    }
  }

  export function ThemeProvider(props: ThemeProviderProps): JSX.Element

  export function useTheme(): {
    theme: string | undefined
    setTheme: (theme: string) => void
    resolvedTheme: string | undefined
    themes: string[]
  }
} 