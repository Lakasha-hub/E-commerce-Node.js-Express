import mongoose from "mongoose";
import { expect } from "chai";
import supertest from "supertest";

import { generateProductTest } from "../src/mocks/product.mock.js";
import { generateUserRegister } from "../src/mocks/user.mocks.js";

import environmentOptions from "../src/constants/server/environment.options.js";

import ProductManager from "../src/dao/mongo/manager/products.manager.js";
import CartManager from "../src/dao/mongo/manager/carts.manager.js";
import UsersManager from "../src/dao/mongo/manager/users.manager.js";

const requester = supertest(environmentOptions.app.BASE_URL);
mongoose.connect(environmentOptions.mongo.URL_CONNECTION_TEST);

describe("Integration Test of main routers", function () {
  before(async function () {
    //Login with admin credentials
    const admin = {
      email: environmentOptions.app.ADMIN_EMAIL,
      password: environmentOptions.app.ADMIN_PASSWORD,
    };
    const res = await requester.post("/api/sessions/login").send(admin);
    //Get cookie for policies
    this.authCookie = res.headers["set-cookie"][0];
    //Instance Manager to verify insertions and deletions
    this.productManager = new ProductManager();
    this.cartManager = new CartManager();
    this.usersManager = new UsersManager();
  });

  describe("Test Products router", function () {
    before(function () {
      this.productTest = generateProductTest();
    });

    after(function () {
      mongoose.connection.collections.products.drop();
    });

    it("GET /api/products should return products paginated", async function () {
      const { status, _body } = await requester
        .get("/api/products")
        .set("Cookie", this.authCookie);

      expect(status).to.be.equal(200);
      expect(_body.page).to.be.ok;
      expect(Array.isArray(_body.payload)).to.be.true;
    });

    it("POST /api/products should create a product correctly", async function () {
      const { status } = await requester
        .post("/api/products")
        .send(this.productTest)
        .set("Cookie", this.authCookie);

      const product = await this.productManager.getProductBy({
        title: this.productTest.title,
      });
      //Save the product id for the following tests
      this.productTest._id = product._id;

      expect(status).to.be.equal(201);
      expect(product._id).to.be.ok;
    });

    it("PUT /api/products/{id} should update a product correctly", async function () {
      const { status, _body } = await requester
        .put(`/api/products/${this.productTest._id}`)
        .send({ title: "Product updated", price: 1.0 })
        .set("Cookie", this.authCookie);

      expect(status).to.be.equal(200);
      expect(_body.payload.price).to.be.equal(1.0);
      expect(_body.payload.title).to.be.equal("Product updated");
    });

    it("DELETE /api/products/{id} should delete a product correctly", async function () {
      const { status } = await requester
        .delete(`/api/products/${this.productTest._id}`)
        .set("Cookie", this.authCookie);

      const product = await this.productManager.getProductById(
        this.productTest._id
      );

      expect(status).to.be.equal(200);
      expect(product).to.be.equal(null);
    });
  });

  describe("Test Carts router", function () {
    before(async function () {
      this.cartTest = {};
      this.productTest = generateProductTest();
    });

    after(function () {
      mongoose.connection.collections.products.drop();
      mongoose.connection.collections.carts.drop();
    });

    it("POST /api/carts should return cart without products and insert in db correctly", async function () {
      const { status, _body } = await requester
        .post("/api/carts")
        .set("Cookie", this.authCookie);

      //Save cart for the following tests
      this.cartTest = _body.payload;

      expect(status).to.be.equal(201);
      expect(_body.payload._id).to.be.ok;
      expect(Array.isArray(_body.payload.products)).to.be.true;
      expect(_body.payload.products.length).to.be.equal(0);
    });

    it("GET /api/carts/{id} should return a cart correctly", async function () {
      const { status, _body } = await requester
        .get(`/api/carts/${this.cartTest._id}`)
        .set("Cookie", this.authCookie);

      expect(status).to.be.equal(200);
      expect(_body.payload._id).to.be.ok;
    });

    it("POST /api/carts/{id}/products/{pid} should add the product to the cart", async function () {
      //Create in database product test
      await requester
        .post("/api/products")
        .send(this.productTest)
        .set("Cookie", this.authCookie);

      const product = await this.productManager.getProductBy({
        title: this.productTest.title,
      });
      //Save the product id for the following tests
      this.productTest._id = product._id;

      const { status, _body } = await requester
        .post(`/api/carts/${this.cartTest._id}/products/${product._id}`)
        .set("Cookie", this.authCookie);

      expect(status).to.be.equal(200);
      expect(_body.payload.products.length).to.be.equal(1);
    });

    it("PUT /api/carts/{id} should be update a quantity of product correctly", async function () {
      const { status } = await requester
        .put(`/api/carts/${this.cartTest._id}`)
        .send({ products: [{ quantity: 3, product: this.productTest._id }] })
        .set("Cookie", this.authCookie);

      const cartUpdated = await this.cartManager.getCartById(this.cartTest._id);
      expect(status).to.be.equal(200);
      expect(cartUpdated.products[0].quantity).to.be.equal(3);
    });
  });

  describe("Test Sessions router", function () {
    before(async function () {
      this.cartTest = {};
      this.userTest = generateUserRegister();
    });

    it("POST /api/sessions/register should correctly register a user and with a cart id", async function () {
      const { status } = await requester
        .post("/api/sessions/register")
        .send(this.userTest);

      const user = await this.usersManager.getUserBy({
        email: this.userTest.email,
      });

      expect(status).to.be.equal(201);
      expect(user._id).to.be.ok;
      expect(user.cart).to.be.ok;
    });

    it("POST /api/sessions/login should create an authorization token correctly", async function () {
      const { status, headers } = await requester
        .post("/api/sessions/login")
        .send({ email: this.userTest.email, password: this.userTest.password });

      const cookieFromHeaders = headers["set-cookie"][0];
      this.authCookie = {
        name: cookieFromHeaders.split("=")[0],
        value: cookieFromHeaders.split("=")[1],
      };

      expect(status).to.be.equal(200);
      expect(this.authCookie.name).to.be.equal(
        environmentOptions.jwt.TOKEN_NAME
      );
      expect(this.authCookie.value).to.be.ok;
    });

    it("GET /api/sessions/current should return the token's user data", async function () {
      const { status, _body } = await requester
        .get("/api/sessions/current")
        .set("Cookie", `${this.authCookie.name}=${this.authCookie.value}`);

      expect(status).to.be.equal(200);
      expect(_body.payload.email).to.be.ok.and.to.be.equal(this.userTest.email);
    });
  });
});
