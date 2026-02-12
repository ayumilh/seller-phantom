/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRIMARY_COLOR: string
  readonly VITE_BACKGROUND_COLOR: string
  readonly VITE_CARD_BACKGROUND: string
  readonly VITE_PRIMARY_LIGHT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}