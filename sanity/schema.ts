import { type SchemaTypeDefinition } from "sanity";
import product from "./schemas/product";
import page from "./schemas/page";
import settings from "./schemas/settings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, page, settings, {
    name: "lead", title: "Lead", type: "document", fields: [
      { name: "name", type: "string" },
      { name: "email", type: "string" },
      { name: "phone", type: "string" },
      { name: "budget", type: "string" },
      { name: "notes", type: "text" },
    ]
  }],
};
















