import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'gericht',
  title: 'Gericht',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'kategorie',
      title: 'Kategorie',
      type: 'string',           // <-- chỉ là string, không options
      description:
        'Bitte genau eingeben: "vorspeise", "hauptgericht", "nachspeise" oder "getraenk".',
    }),
    defineField({
      name: 'preis',
      title: 'Preis (€)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'beschreibung',
      title: 'Beschreibung',
      type: 'text',
    }),
    defineField({
      name: 'bild',
      title: 'Bild',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'aktiv',
      title: 'Aktiv',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sortierung',
      type: 'number',
    }),
  ],
})
