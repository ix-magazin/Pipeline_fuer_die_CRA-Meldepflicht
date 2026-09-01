import { Parser, type Diagnostic } from "@asyncapi/parser";

const parser = new Parser();

export async function validateAsyncApiDocument(document: string): Promise<Diagnostic[]> {
  const { diagnostics } = await parser.parse(document);
  return diagnostics.filter((diagnostic) => diagnostic.severity === 0);
}
