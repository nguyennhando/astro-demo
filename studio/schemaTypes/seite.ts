import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'seite',
  title: 'Seite',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Schlüssel',
      type: 'string',
      description: 'z.B. "ueber-uns", "kontakt", "startseite"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titel',
      title: 'Titel',
      type: 'string',
    }),
    defineField({
      name: 'inhalt',
      title: 'Inhalt',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
})
