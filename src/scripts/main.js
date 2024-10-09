const { db, users } = require("./drizzle.config");

// Insert a new user
db.insert(users)
  .values({
    name: "John Doe",
    age: 30,
  })
  .then(() => console.log("User inserted"));

// Select users
db.select()
  .from(users)
  .then((result) => {
    console.log("Users:", result);
  });
