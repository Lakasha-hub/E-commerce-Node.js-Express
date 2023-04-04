import fs from 'fs';

class ProductManager {
    
    constructor (){
        this.path = './db/database.json';
    };

    async addProduct(title, description, price, thumdnail, code, stock){

        const products = await this.getProducts();
        if( arguments.length < 6 ){
            return console.log('All parameters must be sent');
        };

        const verifyCodeProduct = products.some( product => product.code == code); 
        if( verifyCodeProduct ){
            return console.log('The product is registered');
        };

        const newProduct = {
            title,
            description,
            price,
            thumdnail,
            code,
            stock
        };
        
        //Adds id autoincrementable
        ( products.length == 0 ) ? newProduct.id = 1 : newProduct.id = products.length + 1
       
        products.push( newProduct );
        return fs.promises.writeFile(this.path, JSON.stringify(products));
    };

    getProducts = async() => {
        if( fs.existsSync(this.path) ){
            const data = await fs.promises.readFile( this.path, 'utf-8');
            const products = JSON.parse(data);
            return products;
        }
        return [];
    };

    getProductById = async( pid ) => {
        const products = await this.getProducts();
        const existsProduct = products.find( product => pid == product.id ) || 'Not found';
        return existsProduct;
    };

    updateProduct = async( pid, newProduct = Object) => {
        //Verify product is an Object
        if( typeof(newProduct) !== 'object' ){
            return console.log('The product to be modify must be of type object');
        };

        const products = await this.getProducts();

        //Checks that the object to be updated exists
        const OldProduct = products.find( p => p.id == pid);
        if( !OldProduct ){
            return console.log(`there is no registered product with id ${ pid }`);
        };

        //Verify code of newProduct
        const verifyCodeProduct = products.some( product => product.code == newProduct.code); 
        if( verifyCodeProduct ){
            return console.log('There is already a registered product with this code');
        };

        //Add id property to a newProduct because they will be compared
        newProduct.id = pid;
        //Checks the new product has the same properties as the original object
        const haveSameProperties = Object.keys( OldProduct ).every( property => newProduct.hasOwnProperty( property ));
        if( !haveSameProperties ){
            return console.log('The product must have the same properties as requested by the ProductManager');
        };

        products[products.indexOf(OldProduct)] = newProduct;
        return fs.promises.writeFile(this.path, JSON.stringify(products));
    };

    deleteProduct = async( pid ) => {

        const products = await this.getProducts();
        const existsProduct = products.find( product => pid == product.id );
        if( !existsProduct ){
            return console.log(`there is no registered product with id ${ pid }`)
        };
        products.splice( products.indexOf( existsProduct ) , 1 );
        fs.promises.writeFile(this.path, JSON.stringify(products));
    };
};

export default ProductManager;