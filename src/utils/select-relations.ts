// CART-ITEMS
export const selectCartItem = {
  id: true,
  createdAt: true,
  quantity: true,
  product: {
    id: true,
    name: true,
    price: true,
    brand: { id: true, name: true },
  },
  cart: {
    id: true,
    user: { id: true, username: true },
  },
};

export const relationsCartItem = {
  product: { brand: true },
  cart: { user: true },
};

// CARTS
export const selectCart = {
  user: { id: true, username: true },
  items: {
    id: true,
    quantity: true,
    product: {
      id: true,
      name: true,
      price: true,
      brand: { id: true, name: true },
    },
  },
};

export const relationsCart = {
  user: true,
  items: { product: { brand: true } },
};

// ORDERS
export const selectOrder = {
  user: {
    id: true,
    username: true,
    fullname: true,
    email: true,
    address: true,
    phone: true,
  },
};

export const relationsOrder = { user: true };
