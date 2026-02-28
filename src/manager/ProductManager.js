import fs from "fs";
import path from "path";

class ProductManager {
    constructor() {
        this.path = path.join(process.cwd(),'data','products.json');
}

//ver todos los productos
getProducts(){
    try{
        const data = fs.readFileSync(this.path,'utf-8');
        return JSON.parse(data);
    }catch(error){
        return [];
    }
}

  //obtener productos por el id
getProductsById (id){
    const products = this.getProducts();
    return products.find(p => p.id === parseInt(id));
    }


    //agregar un producto nuevo

addProduct (productData){
    const products = this.getProducts();

    // validar campos requeridos 
    const {title,description,price,stock}= productData

    if ( !title || !description || !price || stock === undefined) {
        throw new Error("FALTAN CAMPOS REQUERIDOS")
    }

    // validar tipos de datos
    if (typeof price !== 'number' || price <= 0) {
        throw new Error("EL PRECIO DEBE SER UN NÚMERO POSITIVO");
    }

    if (!Number.isInteger(stock) || stock < 0) {
        throw new Error("EL STOCK DEBE SER UN NÚMERO ENTERO NO NEGATIVO");
    }

    // generar nuevo ID 
    const newId = products.length > 0 ? Math.max(...products.map(p => parseInt(p.id))) + 1 : 1;

    // crear el nuevo producto
    const newProduct = {
        id: newId,
        title,
        description,
        price,
        status: true,
        stock,
        thumbnails: productData.thumbnails || []
    };

    // llena el  array y guardar
    products.push(newProduct);
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));

    return newProduct;
}
//Actualizar producto 

updateProduct(id,updates){
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === parseInt(id));

    if (index === -1){
        return null;
    }

    // no permitir actualizar el id
    delete updates.id;

    // validar tipos si se están actualizando
    if (updates.price !== undefined) {
        if (typeof updates.price !== 'number' || updates.price <= 0) {
            throw new Error("EL PRECIO DEBE SER UN NÚMERO POSITIVO");
        }
    }

    if (updates.stock !== undefined) {
        if (!Number.isInteger(updates.stock) || updates.stock < 0) {
            throw new Error("EL STOCK DEBE SER UN NÚMERO ENTERO NO NEGATIVO");
        }
    }

    // actualizar el producto manteniendo los valores existentes
    products[index] = {
        ...products[index],
        ...updates
    };

    // guardar cambios
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));

    return products[index];
}
// borra producto
deleteProduct(id){
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === parseInt(id));

    if (index === -1){
        return null;
    }
    const deletedProduct = products.splice(index, 1)[0];

    // guardar cambios en el archivo
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));

    return deletedProduct;
}
}

export default ProductManager;