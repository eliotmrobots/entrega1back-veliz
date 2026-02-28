const socket = io();

const form = document.getElementById("productForm");
const list = document.getElementById("productsList");
const emptyState = document.getElementById("emptyState");

const renderProducts = (products) => {
  list.innerHTML = "";

  if (!products.length) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  products.forEach((product) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${product.title}</strong> - $${product.price} (ID: ${product.id})
      <button data-id="${product.id}">Eliminar</button>
    `;
    list.appendChild(item);
  });
};

socket.on("products", (products) => {
  renderProducts(products);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const title = data.get("title");
  const description = data.get("description");
  const price = Number(data.get("price"));
  const stock = Number(data.get("stock"));
 
  socket.emit("product:create", { title, description, price, stock });
  form.reset();
});

list.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const id = target.dataset.id;
  socket.emit("product:delete", id);
});
