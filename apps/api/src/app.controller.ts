import { Body, Controller, Get, Post } from "@nestjs/common";
import { validateAsyncApiDocument } from "@beispielshop/schema-tools";
import eventsDocument from "./events.asyncapi.json";

@Controller()
export class AppController {
  @Get("health")
  health() {
    return { status: "ok" };
  }

  @Get("schema-document")
  schemaDocument() {
    return eventsDocument;
  }

  @Get("schema-check")
  schemaCheck() {
    return this.validate(eventsDocument);
  }

  @Post("schema-check")
  schemaCheckDocument(@Body() document: unknown) {
    return this.validate(document);
  }

  private async validate(document: unknown) {
    const errors = await validateAsyncApiDocument(JSON.stringify(document));
    return { valid: errors.length === 0, errors };
  }
}
