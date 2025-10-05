import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import {Toaster} from "react-hot-toast";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        return pages[`./pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        return root.render(
            <>
                <App {...props} />
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                        fontSize: "17px",
                        padding: "16px 24px",
                        borderRadius: "10px",
                        maxWidth: "800px",
                        whiteSpace: "nowrap", // 👈 todo en una línea
                        },
                        success: { iconTheme: { primary: "#22c55e", secondary: "white" } },
                        error: { iconTheme: { primary: "#dc2626", secondary: "white" } },
                    }}
                />  
            </>
        );  
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
