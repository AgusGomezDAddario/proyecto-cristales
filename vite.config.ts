import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import path from 'path'; // 👈 necesario
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    server: {
        host: '127.0.0.1',
        port: 5173,
        strictPort: true,
        hmr: { host: '127.0.0.1' }, // evita ws hacia 'localhost'
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'), // 👈 aquí se define el alias @
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
});
