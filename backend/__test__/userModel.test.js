const User = require("../models/user");
const { resetPizzeriaTable, pool } = require("./testHelper");

let client;

beforeAll(async () => {
  client = await pool.connect();
});

beforeEach(() => {
  return resetPizzeriaTable();
});

afterAll(async () => {
  await client.release();
  await pool.end();
});

describe("User Model", () => {
  test("should list all users", async () => {
    const users = await User.findAll();
    expect(users).toBeInstanceOf(Array);
  });

  test("should retrieve a user by ID", async () => {
    const user = await User.findById(1);
    expect(user).toBeInstanceOf(Object);
    expect(user.id).toBe(1);
  });

  test("should create a new user", async () => {
    const newUser = {
      email: "testuser3@example.com",
      password: "password789",
      name: "Test User 3",
      username: "testuser3",
      address: "789 Oak St, City",
    };

    const createdUser = await User.create(newUser);

    expect(createdUser).toHaveProperty("id");
    expect(createdUser.email).toBe(newUser.email);
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.username).toBe(newUser.username);
    expect(createdUser.address).toBe(newUser.address);
  });

  test("should update an existing user", async () => {
    const updatedUser = {
      email: "updateduser@example.com",
      password: "updatedpassword",
      name: "Updated User",
      username: "updateduser",
      address: "123 Updated St, City",
    };

    const existingUser = await User.findById(1);
    const updatedUserResult = await User.update(existingUser.id, updatedUser);

    expect(updatedUserResult).toHaveProperty("id");
    expect(updatedUserResult.email).toBe(updatedUser.email);
    expect(updatedUserResult.name).toBe(updatedUser.name);
    expect(updatedUserResult.username).toBe(updatedUser.username);
    expect(updatedUserResult.address).toBe(updatedUser.address);
  });

  test("should delete an existing user", async () => {
    const existingUser = await User.findById(1);
    const deletionResult = await User.delete(existingUser.id);

    expect(deletionResult).toBe(true);

    const deletedUser = await User.findById(existingUser.id);
    expect(deletedUser).toBeUndefined();
  });
});
