"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select"
import { useState } from "react"

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
    onChange: (languages: string[]) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    selectedLanguages,
    onChange
}) => {
    const [selectedLanguage, setSelectedLanguage] = useState<string>("en")

    const handleLanguageChange = (value: string) => {
        setSelectedLanguage(value)
    }

    return (
        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger 
                className="w-[180px] mx-auto" 
                aria-label="Select Language"
            >
                <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent align="center">
                {languages.map((language) => (
                    <SelectItem 
                        key={language.value} 
                        value={language.value}
                    >
                        {language.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}