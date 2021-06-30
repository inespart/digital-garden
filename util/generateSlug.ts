export function generateSlug(title: string) {
  return title.replace(/\s+/g, '-').toLowerCase();
}
