/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GITHUB_API_BASE_URL: string | undefined;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
