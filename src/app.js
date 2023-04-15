import ProductManager from "./models/products.js";
import Express from "express";

//Create instance of ProductManager
const productManager = new ProductManager();
//Create instance of express
const app = Express();

app.get("/products", async (req, res) => {
  //Call file with Products
  const products = await productManager.getProducts();

  //Get query param Limit
  const { limit } = req.query;

  //Return all products if limit is not a number or is not sent
  if (isNaN(Number(limit))) {
    return res.status(200).json({ products });
  }

  //Return filtered products
  products = products.slice(0, Number(limit));
  return res.status(200).json({ limitedProducts });
});

app.get("/products/:pid", async (req, res) => {
  //Get query param Limit
  const { pid } = req.params;

  //Find product
  const product = await productManager.getProductById(pid);
  //if not exists
  if (!product) {
    return res.status(404).json({
      msg: `there is no registered product with id ${pid}`,
    });
  }
  return res.status(200).json({ product });
});

//Server Listen
app.listen(8081, () => {
  console.log("Server running on: http://localhost:8081");
});
