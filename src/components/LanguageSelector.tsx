"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"
import { cn } from "../lib/utils"

// 定义支持的语言列表
const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "it", label: "Italiano" },
    { value: "pt", label: "Português" },
    { value: "ru", label: "Русский" },
    { value: "zh", label: "中文" },
    { value: "ja", label: "日本語" },
    { value: "ko", label: "한국어" },
] as const

interface LanguageSelectorProps {
    selectedLanguages: string[];
    onLanguagesChange: (languages: string[]) => void;
    disabled?: boolean;
    className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    selectedLanguages,
    onLanguagesChange,
    disabled,
    className
}) => {
    const handleLanguageChange = (value: string) => {
        if (selectedLanguages.includes(value)) {
            onLanguagesChange(selectedLanguages.filter(lang => lang !== value));
        } else {
            onLanguagesChange([...selectedLanguages, value]);
        }
    }

    return (
        <Select 
            value={selectedLanguages[selectedLanguages.length - 1] || ''} 
            onValueChange={handleLanguageChange}
            disabled={disabled}
        >
            <SelectTrigger 
                className={cn("w-[180px]", className)} 
                aria-label="Select Language"
            >
                <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
                {languages.map((language) => (
                    <SelectItem 
                        key={language.value} 
                        value={language.value}
                        className="flex items-center justify-between"
                    >
                        <span>{language.label}</span>
                        {selectedLanguages.includes(language.value) && (
                            <span className="ml-2 text-primary">✓</span>
                        )}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}