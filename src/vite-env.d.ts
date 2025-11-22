/// <reference types="vite/client" />

// Manually define process to prevent TS errors when using process.env.API_KEY
declare const process: {
  env: {
    API_KEY: string;
    [key: string]: any;
  };
};

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
