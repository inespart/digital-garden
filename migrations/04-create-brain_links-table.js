// This is the description of the change
// to the database
exports.up = async function up(sql) {
  await sql`
    CREATE TABLE brain_links (
      seed_id_owner INT REFERENCES seeds (id),
			seed_id_linked INT REFERENCES seeds (id)
    )
  `;
};

// This is the description of the REVERSE
// of the change to the database
exports.down = async function down(sql) {
  await sql`
    DROP TABLE brain_links
  `;
};
