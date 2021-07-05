const categories = [
  { id: 1, title: 'Business' },
  { id: 2, title: 'Education' },
  { id: 3, title: 'Entertainment' },
  { id: 4, title: 'Health' },
  { id: 5, title: 'Personal Development' },
  { id: 6, title: 'Psychology' },
  { id: 7, title: 'Technology' },
];

exports.up = async function up(sql) {
  await sql`
    INSERT INTO categories ${sql(categories, 'id', 'title')}
  `;
};

exports.down = async function down(sql) {
  for (const category of categories) {
    await sql`
      DELETE FROM
        categories
      WHERE
        title = ${category.title}
    `;
  }
};
