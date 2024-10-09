const { Pool } = require("pg");
const faker = require("faker");

// PostgreSQL connection setup
const pool = new Pool({
  user: "postgres", // Replace with your PostgreSQL username
  host: "localhost", // Replace with your PostgreSQL host
  database: "subtubes", // Replace with your PostgreSQL database name
  password: "postgres", // Replace with your PostgreSQL password
  port: 5432, // Replace with your PostgreSQL port if different
});

// Number of records to generate
const NUM_RECORDS = 1000000;

// Function to generate a random event
function generateRandomEvent() {
  const createdAt = faker.date.between("2024-07-01", "2024-11-01");
  return {
    event_type: faker.random.arrayElement([
      "user_signup",
      "purchase",
      "system_error",
      "login",
      "logout",
    ]),
    user_id: faker.datatype.number({ min: 1, max: 10000000 }),
    system_id: faker.datatype.number({ min: 1, max: 100 }),
    event_data: JSON.stringify({
      description: faker.lorem.sentence(),
      metadata: { key: faker.datatype.uuid() },
    }),
    created_at: createdAt,
    updated_at: createdAt,
  };
}

// Function to insert events in batches
async function insertEventsInBatches(batchSize) {
  for (let i = 0; i < NUM_RECORDS; i += batchSize) {
    const values = [];
    const placeholders = [];
    let paramIndex = 1;

    const currentBatchSize = Math.min(batchSize, NUM_RECORDS - i);

    for (let j = 0; j < currentBatchSize; j++) {
      const event = generateRandomEvent();

      values.push(
        event.event_type,
        event.user_id,
        event.system_id,
        event.event_data,
        event.created_at,
        event.updated_at
      );

      placeholders.push(
        `($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${
          paramIndex + 3
        }, $${paramIndex + 4}, $${paramIndex + 5})`
      );

      paramIndex += 6;
    }

    const query = `
      INSERT INTO events (event_type, user_id, system_id, event_data, created_at, updated_at)
      VALUES ${placeholders.join(", ")};
    `;

    try {
      await pool.query(query, values);
      console.log(`Inserted batch ${Math.ceil((i + 1) / batchSize)}`);
    } catch (err) {
      console.error("Error inserting batch:", err);
      // Optionally, you can add error handling or retry logic here
    }
  }

  console.log("Finished inserting all records");
}

// Run the insertion in batches of 10,000 for better performance
const BATCH_SIZE = 10000;

insertEventsInBatches(BATCH_SIZE).then(() => pool.end());
