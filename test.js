import ProductManager from './models/products.js';

// Testing 


const main = async() =>{
    //Create Instance
    const productManager = new ProductManager();
    console.log(await productManager.getProducts()); // []
    
    await productManager.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25);
    console.log( await productManager.getProducts() ); // [producto prueba]
    
    console.log( await productManager.getProductById(1) ); // [producto prueba]
    
    const testProduct = {
        title: '',
        description: 'desc updated',
        price:10,
        thumdnail:'3sdfs.gif',
        code:'newcode',
        stock:25
    }
    
    await productManager.updateProduct(1, testProduct);
    console.log( await productManager.getProducts() ); // [testProduct]
    
    await productManager.deleteProduct(1);
    console.log( await productManager.getProducts() ); // []

}

main();