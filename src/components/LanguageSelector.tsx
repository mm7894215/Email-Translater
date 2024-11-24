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
    { value: "ko", label: "한国어" },
] as const

interface LanguageSelectorProps {
    selectedLanguages: string[];
    onChange: (languages: string[]) => void;
    className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    selectedLanguages,
    onChange,
    className
}) => {
    const handleLanguageChange = (value: string) => {
        if (selectedLanguages.includes(value)) {
            onChange(selectedLanguages.filter(lang => lang !== value));
        } else {
            onChange([...selectedLanguages, value]);
        }
    }

    return (
        <Select 
            value={selectedLanguages[selectedLanguages.length - 1] || ''} 
            onValueChange={handleLanguageChange}
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