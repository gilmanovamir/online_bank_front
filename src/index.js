import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ColorModeProvider } from "./components/ui/color-mode";
import {ChakraProvider, createSystem, defaultConfig} from "@chakra-ui/react";
import reportWebVitals from "./reportWebVitals";

const system = createSystem(defaultConfig, {
    theme: {
        tokens: {},
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ChakraProvider value={system}>
            <ColorModeProvider>
                <App />
            </ColorModeProvider>
        </ChakraProvider>
    </React.StrictMode>
);

reportWebVitals();