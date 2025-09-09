import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r)=>r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r)=>r.required() }),
    defineField({ name: "content", type: "array", of: [{ type: "block" }] }),
  ],
});










