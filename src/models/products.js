import fs from "fs";

class ProductManager {
  constructor() {
    this.path = "./db/database.json";
  }

  addProduct = async ({
    title,
    description,
    price,
    thumdnail,
    code,
    stock,
  }) => {
    try {
      //Call file with Products
      const products = await this.getProducts();

      //Verify code Product
      const verifyCodeProduct = products.some(
        (product) => product.code == code
      );
      if (verifyCodeProduct) {
        throw new Error("The product is registered");
      }

      const newProduct = {
        title,
        description,
        price,
        thumdnail,
        code,
        stock,
      };

      //Adds id autoincrementable
      products.length == 0
        ? (newProduct.id = 1)
        : (newProduct.id = products.length + 1);

      //Add newProduct to Products Array
      products.push(newProduct);

      //Re-Write file with Products
      return fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (error) {
      console.log(error);
    }
  };

  getProducts = async () => {
    //Verify Path
    if (fs.existsSync(this.path)) {
      //Read file
      const data = await fs.promises.readFile(this.path, "utf-8");

      //Format data to JSON
      const products = JSON.parse(data);

      return products;
    }
    return [];
  };

  getProductById = async (pid) => {
    try {
      //Call file with Products
      const products = await this.getProducts();

      //Verify Product Exists
      const existsProduct = products.find((product) => pid == product.id);
      if (!existsProduct) {
        throw new Error("Not Found");
      }

      return existsProduct;
    } catch (error) {
      console.log(error);
    }
  };

  updateProduct = async (pid, properties = Object) => {
    try {
      //Verify product is an Object
      if (typeof properties !== "object") {
        throw new Error(
          "The properties to be updated must be sent into an object"
        );
      }
      //Call file with Products
      const products = await this.getProducts();

      //Checks that the object to be updated exists
      const oldProductIndex = products.findIndex((p) => p.id == pid);
      if (oldProductIndex == -1) {
        throw new Error(`there is no registered product with id ${pid}`);
      }

      //Verify code of newProduct
      const verifyCodeProduct = products.some(
        (product) => product.code == properties.code
      );
      if (verifyCodeProduct) {
        throw new Error("There is already a registered product with this code");
      }

      //Update Properties
      const newProduct = { ...products[oldProductIndex], ...properties };
      products[oldProductIndex] = newProduct;

      //Re-Write file of products
      return fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (pid) => {
    try {
      //Call file with Products
      const products = await this.getProducts();

      //Verify Product exists
      const existsProductIndex = products.find((product) => pid == product.id);
      if (existsProductIndex == -1) {
        throw new Error(`there is no registered product with id ${pid}`);
      }
      //Remove product from Products Array
      products.splice(existsProductIndex, 1);

      //Re-Write file with Products
      fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (error) {
      console.log(error);
    }
  };
}

export default ProductManager;
