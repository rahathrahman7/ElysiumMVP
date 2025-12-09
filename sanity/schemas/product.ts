import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r)=>r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r)=>r.required() }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "images", type: "array", of: [{ type: "image" }] }),
    defineField({ name: "basePriceGBP", type: "number", description: "Price in pence", validation: (r)=>r.required() }),
    defineField({
      name: "options",
      type: "object",
      fields: [
        { name: "metals", type: "array", of: [{ type: "object", fields: [{ name: "name", type: "string" }, { name: "priceDelta", type: "number" }] }] },
        { name: "stones", type: "array", of: [{ type: "object", fields: [{ name: "name", type: "string" }, { name: "priceDelta", type: "number" }] }] },
        { name: "cuts", type: "array", of: [{ type: "object", fields: [{ name: "name", type: "string" }, { name: "priceDelta", type: "number" }] }] },
      ],
    }),
    defineField({ name: "ringSizes", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "caratOptions", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "inStock", type: "boolean", initialValue: true }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "seoTitle", type: "string" }),
    defineField({ name: "seoDescription", type: "text" }),
  ],
});
















