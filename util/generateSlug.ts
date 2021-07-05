export function generateSlug(userId: number, title: string) {
  return `${userId}-` + title.replace(/\s+/g, '-').toLowerCase();
}
