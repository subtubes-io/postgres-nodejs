const { Pool } = require("pg");
const faker = require("faker");

const args = process.argv.slice(2);

// Function to parse named arguments
function parseArgs(args) {
  const argObject = {};
  args.forEach((arg) => {
    const [key, value] = arg.split("=");
    argObject[key.replace("--", "")] = value;
  });
  return argObject;
}

const parsedArgs = parseArgs(args);
const NUM_RECORDS = parsedArgs.numRecords
  ? parseInt(parsedArgs.numRecords, 10)
  : 1000000; // Default value

if (isNaN(NUM_RECORDS)) {
  console.error("Invalid number of records. Please provide a valid integer.");
  process.exit(1);
}

const pool = new Pool({
  user: "postgres",
  host: "subtubes-postgres",
  database: "subtubes",
  password: "postgres",
  port: 5432,
});

async function fetchUserIds() {
  try {
    const res = await pool.query("SELECT id FROM users");
    return res.rows.map((row) => row.id);
  } catch (err) {
    console.error("Error fetching user IDs:", err);
    process.exit(1);
  }
}

// Function to generate a random event
function generateRandomEvent(userIds) {
  const createdAt = faker.date.between("2024-07-01", "2024-11-01");
  return {
    event_type: faker.random.arrayElement([
      "user_signup",
      "purchase",
      "system_error",
      "login",
      "logout",
    ]),
    user_id: faker.random.arrayElement(userIds), // Use random user_id from the fetched list
    system_id: faker.datatype.number({ min: 1, max: 100 }),
    event_data: JSON.stringify({
      description: faker.lorem.sentence(),
      metadata: { key: faker.datatype.uuid() },
    }),
    created_at: createdAt,
    updated_at: createdAt,
  };
}

async function insertEventsInBatches(batchSize, userIds) {
  for (let i = 0; i < NUM_RECORDS; i += batchSize) {
    const values = [];
    const placeholders = [];
    let paramIndex = 1;

    const currentBatchSize = Math.min(batchSize, NUM_RECORDS - i);

    for (let j = 0; j < currentBatchSize; j++) {
      const event = generateRandomEvent(userIds);

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
    }
  }

  console.log("Finished inserting all records");
}

const BATCH_SIZE = 10000;

(async () => {
  const userIds = await fetchUserIds(); // Fetch user IDs from the users table
  await insertEventsInBatches(BATCH_SIZE, userIds);
  pool.end();
})();
