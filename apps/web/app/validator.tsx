"use client";

import { useState } from "react";

interface CheckResult {
  valid: boolean;
  messages: string[];
}

async function checkDocument(input: string): Promise<CheckResult> {
  try {
    JSON.parse(input);
  } catch {
    return { valid: false, messages: ["Eingabe ist kein gültiges JSON"] };
  }
  try {
    const response = await fetch("/api/check", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: input
    });
    return (await response.json()) as CheckResult;
  } catch {
    return { valid: false, messages: ["Anfrage fehlgeschlagen"] };
  }
}

export function Validator({ initialDocument }: { initialDocument: string }) {
  const [input, setInput] = useState(initialDocument);
  const [result, setResult] = useState<CheckResult | null>(null);

  return (
    <section>
      <textarea
        rows={18}
        cols={80}
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <br />
      <button onClick={async () => setResult(await checkDocument(input))}>Dokument prüfen</button>
      {result !== null &&
        (result.valid ? (
          <p>Dokument ist gültig</p>
        ) : (
          <ul>
            {result.messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        ))}
    </section>
  );
}
