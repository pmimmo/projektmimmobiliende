interface ProvenExpertRating {
  ratingValue: string;
  ratingCount: string;
}

const FALLBACK: ProvenExpertRating = { ratingValue: "4.93", ratingCount: "23" };
let cached: ProvenExpertRating | null = null;

export async function getProvenExpertRating(): Promise<ProvenExpertRating> {
  if (cached) return cached;
  try {
    const res = await fetch("https://www.provenexpert.com/de-de/projekt-m-immobilien-gmbh/");
    const html = await res.text();
    // Alle JSON-LD Blöcke finden
    const matches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
    for (const m of matches) {
      const data = JSON.parse(m[1]);
      if (data.aggregateRating) {
        cached = {
          ratingValue: String(data.aggregateRating.ratingValue),
          ratingCount: String(data.aggregateRating.ratingCount),
        };
        console.log(`[ProvenExpert] Rating: ${cached.ratingValue}/5 (${cached.ratingCount} Bewertungen)`);
        return cached;
      }
    }
    throw new Error("Kein aggregateRating in JSON-LD gefunden");
  } catch (e) {
    console.warn(`[ProvenExpert] Fetch fehlgeschlagen, verwende Fallback-Werte: ${(e as Error).message}`);
    cached = FALLBACK;
    return cached;
  }
}
