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
    const {title,description,code,price,stock,category}= productData

    if ( !title || !description ||  !code || !price || stock === undefined || !category) {
        throw new Error("FALTAN CAMPOS REQUERIDOS")
    }

    // verificar si el código ya existe
    const codeExists = products.some(p => p.code === code);
    if (codeExists) {
        throw new Error("EL CÓDIGO DEL PRODUCTO YA EXISTE");
    }

    // generar nuevo ID 
    const newId = products.length > 0 ? Math.max(...products.map(p => parseInt(p.id))) + 1 : 1;

    // crear el nuevo producto
    const newProduct = {
        id: newId,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
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