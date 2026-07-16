import { getDocuments } from "@/lib/api";

const CDN_BASE_URL = "https://pub-2bd99ffbe3b44222ae5b1b9c3482209f.r2.dev";

interface ManifestEntry {
  id: string;
  key: string;
}

let docMap: Map<string, string> | null = null;
let initializationPromise: Promise<void> | null = null;

async function initializeMap(): Promise<void> {
  if (docMap) return;
  if (!initializationPromise) {
    initializationPromise = (async () => {
      const documents: ManifestEntry[] = await getDocuments();
      console.log("[CDN Debug] Documents fetched:", documents); // ADD THIS
      if (Array.isArray(documents)) {
        docMap = new Map(documents.map((d) => [d.id, d.key]));
        console.log("[CDN Debug] docMap keys:", Array.from(docMap.keys())); // ADD THIS
      } else {
        docMap = new Map();
      }
    })();
  }
  return initializationPromise;
}

export async function getCdnUrl(cdnId?: string | null): Promise<string | undefined> {
  if (!cdnId) return undefined;
  
  await initializeMap();

  const key = docMap?.get(cdnId);
  
  // LOGGING: Check if the ID exists in the map
  if (!key) {
    console.warn(`[CDN Debug] No match found for cdnId: "${cdnId}"`);
  } else {
    console.log(`[CDN Debug] Success! Match for "${cdnId}" -> "${key}"`);
  }
  
  return key ? `${CDN_BASE_URL}/${key}` : undefined;
}