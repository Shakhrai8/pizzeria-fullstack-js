const MenuItem = require("../models/menuItem");
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

describe("MenuItem Model", () => {
  test("should list all menu items", async () => {
    const menuItems = await MenuItem.findAll();
    expect(menuItems).toBeInstanceOf(Array);
  });

  test("should retrieve a menu item by ID", async () => {
    const menuItem = await MenuItem.findById(1);
    expect(menuItem).toBeInstanceOf(Object);
    expect(menuItem.id).toBe(1);
  });

  test("should create a new menu item", async () => {
    const newMenuItem = {
      name: "New Item",
      description: "New item description",
      price: 9.99,
      ingredients: ["ingredient1", "ingredient2"],
    };

    const createdMenuItem = await MenuItem.create(newMenuItem);

    expect(createdMenuItem).toHaveProperty("id");
    expect(createdMenuItem.name).toBe(newMenuItem.name);
    expect(createdMenuItem.description).toBe(newMenuItem.description);
    expect(createdMenuItem.price).toBe("9.99");
    expect(createdMenuItem.ingredients).toEqual(newMenuItem.ingredients);
  });

  test("should update an existing menu item", async () => {
    const updatedMenuItem = {
      name: "Updated Item",
      description: "Updated item description",
      price: 12.99,
      ingredients: ["updatedIngredient1", "updatedIngredient2"],
    };

    const existingMenuItem = await MenuItem.findById(1);
    const updatedMenuItemResult = await MenuItem.update(
      existingMenuItem.id,
      updatedMenuItem
    );

    expect(updatedMenuItemResult).toHaveProperty("id");
    expect(updatedMenuItemResult.name).toBe(updatedMenuItem.name);
    expect(updatedMenuItemResult.description).toBe(updatedMenuItem.description);
    expect(updatedMenuItemResult.price).toBe("12.99");
    expect(updatedMenuItemResult.ingredients).toEqual(
      updatedMenuItem.ingredients
    );
  });

  test("should delete an existing menu item", async () => {
    const existingMenuItem = await MenuItem.findById(1);
    const deletionResult = await MenuItem.delete(existingMenuItem.id);

    expect(deletionResult).toBe(true);

    const deletedMenuItem = await MenuItem.findById(existingMenuItem.id);
    expect(deletedMenuItem).toBeUndefined();
  });
});
