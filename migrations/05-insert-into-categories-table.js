const categories = [
  { title: 'Business' },
  { title: 'Education' },
  { title: 'Entertainment' },
  { title: 'Health' },
  { title: 'Personal Development' },
  { title: 'Psychology' },
  { title: 'Technology' },
];

exports.up = async function up(sql) {
  await sql`
    INSERT INTO categories ${sql(categories, 'title')}
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
