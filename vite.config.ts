import { resolve, join, extname } from "path";
import { writeFileSync, readdirSync, existsSync } from "fs";
import fg from "fast-glob";
import handlebars from "vite-plugin-handlebars";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import sharp from "sharp";
import { defineConfig } from "vite";
import type { Plugin } from "vite";

const pages = Object.fromEntries(
    fg.sync(["**/index.html", "!dist/**", "!node_modules/**"]).map((p) => {
        const name = p === "index.html" ? "index" : p.replace("/index.html", "");
        return [name, resolve(__dirname, p)];
    })
);

const meta: Record<
    string,
    {
        title: string;
        description: string;
        keywords?: string;
        canonical: string;
        image?: string;
        og?: { type: string };
        sitemap?: { changefreq: string; priority: number };
    }
> = {
    index: {
        title: "Projekt M Immobilien – Ihr Immobilienexperte in München",
        description: "Projekt M Immobilien erstellt zertifizierte Immobiliengutachten, verkauft Immobilien mit Herz und vermittelt in Konflikten mit Fachverstand. Jetzt beraten lassen!",
        keywords: "Immobilien, München, Immobilienmakler, Gutachten, Immobiliengutachten, Mediation, Immobilienbewertung, Projekt M, Rüdiger Neuer, Wohnung verkaufen, Haus verkaufen",
        canonical: "https://projektmimmobilien.de/",
        image: "https://projektmimmobilien.de/img/openGraph.png",
        og: { type: "website" },
        sitemap: { changefreq: "weekly", priority: 0.9 },
    },
    datenschutz: {
        title: "Datenschutzerklärung | Projekt M Immobilien GmbH",
        description: "Datenschutzhinweise.",
        canonical: "https://projektmimmobilien.de/datenschutz/",
        og: { type: "website" },
        sitemap: { changefreq: "yearly", priority: 0.3 },
    },
    impressum: {
        title: "Impressum | Projekt M Immobilien GmbH",
        description: "Impressum",
        canonical: "https://projektmimmobilien.de/impressum/",
        og: { type: "website" },
        sitemap: { changefreq: "yearly", priority: 0.3 },
    },
};

/** Vite-Plugin: Sitemap aus meta-Objekt generieren */
function sitemapPlugin(): Plugin {
    return {
        name: "generate-sitemap",
        closeBundle() {
            const today = new Date().toISOString().split("T")[0];
            const urls = Object.values(meta)
                .filter((m) => m.canonical)
                .map((m) => {
                    const sm = m.sitemap ?? { changefreq: "yearly", priority: 0.3 };
                    return `  <url>\n    <loc>${m.canonical}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${sm.changefreq}</changefreq>\n    <priority>${sm.priority}</priority>\n  </url>`;
                })
                .join("\n\n");

            const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n${urls}\n\n</urlset>\n`;
            writeFileSync(resolve(__dirname, "dist/sitemap.xml"), sitemap);
            console.log("\x1b[32m✓ sitemap.xml generated\x1b[0m");
        },
    };
}

/** Vite-Plugin: AVIF-Kopien für alle Rasterbilder erzeugen (liest aus public/, schreibt nach dist/) */
function avifPlugin(): Plugin {
    return {
        name: "generate-avif",
        async closeBundle() {
            const srcDir = resolve(__dirname, "public/img");
            const destDir = resolve(__dirname, "dist/img");
            if (!existsSync(srcDir) || !existsSync(destDir)) return;

            const files = readdirSync(srcDir, { recursive: true, withFileTypes: true });
            const rasterExts = new Set([".png", ".jpg", ".jpeg"]);
            let count = 0;

            for (const entry of files) {
                if (!entry.isFile()) continue;
                const ext = extname(entry.name).toLowerCase();
                if (!rasterExts.has(ext)) continue;

                const relativePath = join(entry.parentPath ?? entry.path, entry.name).slice(srcDir.length);
                const srcPath = join(srcDir, relativePath);
                const avifPath = join(destDir, relativePath) + ".avif";
                try {
                    await sharp(srcPath).avif({ quality: 65 }).toFile(avifPath);
                    count++;
                } catch (err) {
                    console.warn(`\x1b[33m⚠ AVIF skipped ${entry.name}: ${(err as Error).message}\x1b[0m`);
                }
            }

            console.log(`\x1b[32m✓ ${count} AVIF copies generated\x1b[0m`);
        },
    };
}

/** Vite-Plugin: WebP-Kopien für alle Rasterbilder erzeugen (liest aus public/, schreibt nach dist/) */
function webpPlugin(): Plugin {
    return {
        name: "generate-webp",
        async closeBundle() {
            const srcDir = resolve(__dirname, "public/img");
            const destDir = resolve(__dirname, "dist/img");
            if (!existsSync(srcDir) || !existsSync(destDir)) return;

            const files = readdirSync(srcDir, { recursive: true, withFileTypes: true });
            const rasterExts = new Set([".png", ".jpg", ".jpeg"]);
            let count = 0;

            for (const entry of files) {
                if (!entry.isFile()) continue;
                const ext = extname(entry.name).toLowerCase();
                if (!rasterExts.has(ext)) continue;

                const relativePath = join(entry.parentPath ?? entry.path, entry.name).slice(srcDir.length);
                const srcPath = join(srcDir, relativePath);
                const webpPath = join(destDir, relativePath) + ".webp";
                try {
                    await sharp(srcPath).webp({ quality: 80 }).toFile(webpPath);
                    count++;
                } catch (err) {
                    console.warn(`\x1b[33m⚠ WebP skipped ${entry.name}: ${(err as Error).message}\x1b[0m`);
                }
            }

            console.log(`\x1b[32m✓ ${count} WebP copies generated\x1b[0m`);
        },
    };
}

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
        ViteImageOptimizer({
            png: { quality: 80 },
            jpeg: { quality: 80 },
            jpg: { quality: 80 },
            svg: {
                plugins: [
                    { name: "preset-default" },
                    { name: "removeViewBox", active: false },
                ],
            },
        }),
        sitemapPlugin(),
        avifPlugin(),
        webpPlugin(),
    ],
});
