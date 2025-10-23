import { Buffer } from 'buffer';

// Set up Buffer polyfill BEFORE any other imports
window.Buffer = Buffer;
globalThis.Buffer = Buffer;

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
