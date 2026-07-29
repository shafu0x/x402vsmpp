import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    'src/instrumentation.ts',
    'src/app/**/{page,layout,route,loading,error,global-error,not-found,default,template}.{ts,tsx}',
  ],
  project: ['src/**/*.{ts,tsx}', '*.{ts,mjs}'],
  ignoreDependencies: ['postcss', 'tailwindcss', '@x402/core', '@prisma/client', 'pg', '@types/pg'],
};

export default config;
