export interface Language {
    iso: string;
    isSelected: boolean;
    languageIsoCodesWithLocales: Record<string, string>;
}

export interface Languages {
    [key: string]: Language;
}