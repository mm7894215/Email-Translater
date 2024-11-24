import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleTheme}
      className="w-9 h-9 px-0"
      aria-label="Toggle theme"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleToggleTheme()}
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] ${theme === "light" ? "text-black" : "text-white"} rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] ${theme === "dark" ? "text-white" : "text-black"} rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`} />
      {/* <span className="sr-only">Toggle theme</span> */}
    </Button>
  );
}
