// This is the description of the change
// to the database
exports.up = async function up(sql) {
  await sql`
    CREATE TABLE categories (
      id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
			title varchar(30) NOT NULL
    )
  `;
};

// This is the description of the REVERSE
// of the change to the database
exports.down = async function down(sql) {
  await sql`
    DROP TABLE categories
  `;
};
