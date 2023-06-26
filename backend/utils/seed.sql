-- Reset identity for all tables
TRUNCATE TABLE users, menu_items, orders, order_items RESTART IDENTITY;

INSERT INTO users (email, password, name, username, address)
VALUES
  ('testuser1@example.com', 'password123', 'Test User 1', 'testuser1', '123 Main St, City'),
  ('testuser2@example.com', 'password456', 'Test User 2', 'testuser2', '456 Elm St, City');

-- menu_items table
INSERT INTO menu_items (name, description, price, ingredients)
VALUES
  ('Margherita', 'Classic cheese pizza', 9.99, ARRAY['cheese', 'tomato sauce']),
  ('Pepperoni', 'Pizza with pepperoni toppings', 10.99, ARRAY['cheese', 'tomato sauce', 'pepperoni']);

-- orders table
INSERT INTO orders (user_id, status, total_price)
VALUES
  (1, 'pending', 9.99),
  (2, 'complete', 10.99);

-- order_items table
INSERT INTO order_items (order_id, menu_item_id, quantity)
VALUES
  (1, 1, 1),
  (2, 2, 2);