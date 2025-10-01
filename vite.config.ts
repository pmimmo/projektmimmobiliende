import { resolve } from "path";
import fg from "fast-glob";
import handlebars from "vite-plugin-handlebars";
import { defineConfig } from "vite";

const pages = Object.fromEntries(
    fg.sync(["**/index.html", "!dist/**", "!node_modules/**"]).map((p) => {
        const name = p === "index.html" ? "index" : p.replace("/index.html", "");
        return [name, resolve(__dirname, p)];
    })
);

const meta = {
    index: {
        title: "Projekt M Immobilien – Ihr Immobilienexperte in München",
        description: "Projekt M Immobilien erstellt zertifizierte Immobiliengutachten, verkauft Immobilien mit Herz und vermittelt in Konflikten mit Fachverstand. Jetzt beraten lassen!",
        keywords: "Immobilien, München, Immobilienmakler, Gutachten, Immobiliengutachten, Mediation, Immobilienbewertung, Projekt M, Rüdiger Neuer, Wohnung verkaufen, Haus verkaufen",
        canonical: "https://projektmimmobilien.de/",
        image: "https://projektmimmobilien.de/img/openGraph.jpg",
        og: { type: "website" },
    },
    datenschutz: {
        title: "Datenschutzerklärung | Projekt M Immobilien GmbH",
        description: "Datenschutzhinweise.",
        canonical: "https://projektmimmobilien.de/datenschutz/",
        og: { type: "website" },
    },
    impressum: {
        title: "Impressum | Projekt M Immobilien GmbH",
        description: "Impressum",
        canonical: "https://projektmimmobilien.de/impressum/",
        og: { type: "website" },
    },
};

export default defineConfig({
    server: {
        host: true, // oder '0.0.0.0'
    },
    build: { rollupOptions: { input: pages } },
    plugins: [
        handlebars({
            partialDirectory: resolve(__dirname, "public/partials"),
            context(pagePath) {
                const key = /\/datenschutz\/index\.html$/.test(pagePath) ? "datenschutz" : /\/impressum\/index\.html$/.test(pagePath) ? "impressum" : "index";
                return { ...meta[key], isIndex: key === "index", isDatenschutz: key === "datenschutz", isImpressum: key === "impressum" };
            },
        }),
    ],
});
