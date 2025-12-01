import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'bqwgt6d1',    // <-- THAY ở đây
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
})
