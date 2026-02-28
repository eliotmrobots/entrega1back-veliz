const socket = io();
const form = document.getElementById("productForm");
const productsList = document.getElementById("productsList");
const emptyState = document.getElementById("emptyState");

const renderProducts = (products) => {
  productsList.innerHTML = "";

  if (!products || products.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  products.forEach((product) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${product.title}</strong> - $${product.price} (ID: ${product.id})
      <button type="button" data-id="${product.id}">Eliminar</button>
    `;

    const button = item.querySelector("button");
    button.addEventListener("click", () => {
      socket.emit("product:delete", Number(product.id));
    });

    productsList.appendChild(item);
  });
};

socket.on("products", (products) => {
  renderProducts(products);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock"))
  };

  socket.emit("product:create", payload);
  form.reset();
});
