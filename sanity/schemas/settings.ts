import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "logo", type: "image" }),
    defineField({ name: "nav", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "footer", type: "array", of: [{ type: "string" }] }),
  ],
});
















