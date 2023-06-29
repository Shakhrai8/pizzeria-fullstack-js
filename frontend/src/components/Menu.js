import React, { useState, useEffect } from "react";
import axios from "axios";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    axios
      .get("/menu")
      .then((response) => {
        setMenuItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error);
      });
  }, []);

  return (
    <div>
      <h1>Menu</h1>
      {menuItems.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p>Price: {item.price}</p>
          <p>Ingredients: {item.ingredients}</p>
          <button onClick={() => addToCart(item.id)}>Add to cart</button>
        </div>
      ))}
    </div>
  );

  function addToCart(itemId) {
    // Add the item to cart
    // Code will depend on your cart management (context, Redux, local state, etc.)
  }
};

export default Menu;
