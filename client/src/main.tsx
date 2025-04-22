import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add FontAwesome script
const fontAwesomeScript = document.createElement("script");
fontAwesomeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js";
document.head.appendChild(fontAwesomeScript);

// Add Particles.js script
const particlesScript = document.createElement("script");
particlesScript.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
document.head.appendChild(particlesScript);

createRoot(document.getElementById("root")!).render(<App />);
