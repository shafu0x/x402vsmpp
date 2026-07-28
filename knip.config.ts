import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    'src/app/**/{page,layout,route,loading,error,global-error,not-found,default,template}.{ts,tsx}',
  ],
  project: ['src/**/*.{ts,tsx}', '*.{ts,mjs}'],
  ignore: ['src/components/ui/**'],
  ignoreDependencies: ['postcss', 'tailwindcss', 'agentcash'],
};

export default config;
