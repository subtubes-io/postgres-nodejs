const { Pool } = require("pg");
const faker = require("faker");

const NUM_USERS = 50; // Number of users to create (adjust as needed)

// PostgreSQL connection setup
const pool = new Pool({
  user: "postgres",
  host: "subtubes-postgres",
  database: "subtubes",
  password: "postgres",
  port: 5432,
});

// Function to generate a random user
function generateRandomUser() {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  };
}

async function insertUsersInBatches(batchSize) {
  for (let i = 0; i < NUM_USERS; i += batchSize) {
    const values = [];
    const placeholders = [];
    let paramIndex = 1;

    const currentBatchSize = Math.min(batchSize, NUM_USERS - i);

    for (let j = 0; j < currentBatchSize; j++) {
      const user = generateRandomUser();

      values.push(user.username, user.email, user.created_at, user.updated_at);

      placeholders.push(
        `($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${
          paramIndex + 3
        })`
      );

      paramIndex += 4;
    }

    const query = `
      INSERT INTO users (username, email, created_at, updated_at)
      VALUES ${placeholders.join(", ")};
    `;

    try {
      await pool.query(query, values);
      console.log(`Inserted batch ${Math.ceil((i + 1) / batchSize)}`);
    } catch (err) {
      console.error("Error inserting batch:", err);
    }
  }

  console.log("Finished inserting all users");
}

const BATCH_SIZE = 10000;

insertUsersInBatches(BATCH_SIZE).then(() => pool.end());
