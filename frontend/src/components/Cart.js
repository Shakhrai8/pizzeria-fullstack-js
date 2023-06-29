import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from backend
    axios
      .get("/orders")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  return (
    <div>
      <h1>Cart</h1>
      {orders.map((order) => (
        <div key={order.id}>
          <h3>Order ID: {order.id}</h3>
          <p>Status: {order.status}</p>
          <p>Total Price: {order.total_price}</p>
          {order.items.map((item) => (
            <div key={item.id}>
              <h4>Item ID: {item.menu_item_id}</h4>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Cart;
