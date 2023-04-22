import fs from "fs";

class CartsManager {
  constructor() {
    this.path = "./db/carts.json";
  }

  createCart = async () => {
    //Call file with Carts
    const carts = await this.getCarts();

    //Create Cart
    const newCart = {
      products: [],
    };

    //Adds id autoincrementable
    carts.length == 0 ? (newCart.id = 1) : (newCart.id = carts.length + 1);

    //Add newCart to Carts Array
    carts.push(newCart);

    //Re-Write file with Carts
    fs.promises.writeFile(this.path, JSON.stringify(carts));
    return newCart;
  };

  getCarts = async () => {
    //Verify Path
    if (fs.existsSync(this.path)) {
      //Read File
      const data = await fs.promises.readFile(this.path, "utf-8");
      //Format data to JSON
      const carts = JSON.parse(data);
      return carts;
    }
    return [];
  };

  getCartById = async (cid) => {
    try {
      //Call file with Carts
      const carts = await this.getCarts();

      //Verify Cart Exists
      const existsCart = carts.find((c) => cid == c.id);
      if (!existsCart) {
        throw new Error(`There is no cart registered with id: ${cid}`);
      }
      return existsCart;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  };

  addProductToCart = async (cid, pid) => {
    try {
      //Call file with Carts
      const carts = await this.getCarts();

      //Convert params to number
      cid = parseInt(cid);
      pid = parseInt(pid);

      //Verify Cart Exists
      const cart = carts.find((c) => cid === c.id);
      if (!cart) {
        throw new Error(`There is no cart registered with id: ${cid}`);
      }

      //If the product exists in the cart
      const existProduct = cart.products.find((p) => p.id === pid);
      if (existProduct) {
        //Increment quantity of product
        existProduct.quantity += 1;
        //Re-Write file of Carts
        fs.promises.writeFile(this.path, JSON.stringify(carts));
        return cart;
      }

      //If product not exists in the cart add one
      cart.products.push({
        id: pid,
        quantity: 1,
      });

      //Re-Write file of Carts
      fs.promises.writeFile(this.path, JSON.stringify(carts));
      return cart;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  };
}

export default CartsManager;
