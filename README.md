# Pipeline für die CRA-Meldepflicht
Repository zum [Praxis-Artikel](https://www.heise.de/select/ix/2026/10/2615611580984043675) von [Cornelius May](https://www.linkedin.com/in/cornelius-may-391153208/), erschienen in iX [10/2026](https://www.heise.de/select/ix/2026/10) und auf [heise online](heise.de).

## iX-tract
- Eine automatisierte Build-Pipeline mit SBOM, Sigstore-Signaturen und SBOM-Bestandsplattform schafft die nötige Datenbasis für die Meldepflicht, die der Cyber Resilience Act verlangt, und nimmt die Produktpflichten vorweg, die ab Ende 2027 gelten.
- Karenzzeiten für neue npm-Pakete und Allowlists für Install-Skripte reduzieren das Risiko, kompromittierte Pakete ins Produkt zu holen.
- Dependency-Track, der Abgleich mit KEV- und EUVD-Katalogen sowie ein geprobter Meldeprozess machen die Meldung ausgenutzter Schwachstellen in 24 Stunden möglich. Tooling, VEX-Adoption und die ENISA-Meldeplattform hinken jedoch hinterher.
- Der technische Aufbau der Pipeline ist in wenigen Tagen erledigt. Das eigentliche Projekt sind Bestandsführung, eingespielter Meldeprozess und ein Probelauf vor dem Stichtag.

## Dateien aus dem Artikel

| Artikel | Datei |
|---|---|
| Listing 1 (`pnpm why @asyncapi/specs`) | Kommando nach `pnpm install`. Kette via [`packages/schema-tools/package.json`](packages/schema-tools/package.json) |
| Listing 2 (Karenzzeit und Skript-Allowlist) | [`pnpm-workspace.yaml`](pnpm-workspace.yaml) |
| Listing 3 (Renovate-Cooldown) | [`renovate.json`](renovate.json) |
| Listing 4 (SBOM, Signatur und Provenance) | [`.github/workflows/release.yml`](.github/workflows/release.yml) |
| Listing 5 (Kyverno-Policy) | [`policies/require-signed-images.yaml`](policies/require-signed-images.yaml) |

## Aufbau

- [`apps/api`](apps/api) - NestJS-API, validiert [`events.asyncapi.json`](apps/api/src/events.asyncapi.json). Image aus `pnpm deploy`
- [`apps/web`](apps/web) - Next.js-Frontend. Image aus Standalone-Output
- [`packages/schema-tools`](packages/schema-tools) - geteilte Bibliothek mit `@asyncapi/parser`

## Verwendung

```
pnpm install
pnpm build
pnpm --filter @beispielshop/api deploy --prod apps/api/deploy
docker compose up --build
```

- API: `http://localhost:3001/health`, `http://localhost:3001/schema-check`, `http://localhost:3001/schema-document`
- `POST /schema-check` validiert übergebene AsyncAPI-Dokumente ([Default-Dokument](apps/api/src/events.asyncapi.json))
- Web: `http://localhost:3000` - Editor mit dem Default-Dokument, prüft Eingaben über die API
- Ohne Container: `pnpm --filter @beispielshop/api start` bzw. `... web start`

## Push nach main

Der Workflow läuft bis einschließlich der Container-Builds und scheitert dann am Registry-Login (`harbor.beispielshop.example` ist reserviert und löst nie auf, Secrets fehlen). Für einen echten Lauf:

- Registry und Secrets `HARBOR_USERNAME`/`HARBOR_PASSWORD` setzen (oder auf `ghcr.io/<owner>/...` umstellen, dann genügt `GITHUB_TOKEN`)
- `beispielshop/shop` in [`release.yml`](.github/workflows/release.yml) und [`policies/require-signed-images.yaml`](policies/require-signed-images.yaml) durch das eigene `owner/repo` ersetzen
- Kyverno-Cluster für die Admission-Prüfung
