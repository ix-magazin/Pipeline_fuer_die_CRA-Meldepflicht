import { Validator } from "./validator";

export const dynamic = "force-dynamic";

const apiUrl = process.env.API_URL ?? "http://localhost:3001";

async function fetchDefaultDocument(): Promise<string | null> {
  try {
    const response = await fetch(`${apiUrl}/schema-document`, { cache: "no-store" });
    return JSON.stringify(await response.json(), null, 2);
  } catch {
    return null;
  }
}

export default async function Page() {
  const initialDocument = await fetchDefaultDocument();
  return (
    <main>
      <h1>Beispielshop Backoffice</h1>
      <h2>AsyncAPI-Schemaprüfung</h2>
      {initialDocument === null ? (
        <p>API nicht erreichbar: {apiUrl}</p>
      ) : (
        <Validator initialDocument={initialDocument} />
      )}
    </main>
  );
}
