// This is the description of the change
// to the database
exports.up = async function up(sql) {
  await sql`
    CREATE TABLE seeds (
      id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
			title varchar(50) NOT NULL,
			public_note_id INT UNIQUE REFERENCES notes (id) NOT NULL,
			user_id INT REFERENCES users (id) NOT NULL,
			category_id INT REFERENCES categories (id) NOT NULL,
			is_published boolean NOT NULL,
			private_note_id INT UNIQUE REFERENCES notes (id),
			image_url varchar(200),
			resource_url varchar(200),
      slug varchar(40)
    )
  `;
};

// This is the description of the REVERSE
// of the change to the database
exports.down = async function down(sql) {
  await sql`
    DROP TABLE seeds
  `;
};
