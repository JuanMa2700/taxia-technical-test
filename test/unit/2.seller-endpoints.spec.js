"use strict";

const Product = use("App/Models/Product");
const { test, trait } = use("Test/Suite")("Seller endpoints");
trait("Test/ApiClient");

let token;

test("[Login] seller ok", async ({ client }) => {
  const response = await client
    .post("/authenticate")
    .send({
      email: "seller@gmail.com",
      password: "1234",
    })
    .end();

  token = response.body.token;
  // Check response status
  response.assertStatus(200);
});

test("products request without token", async ({ client }) => {
  const response = await client.get("/seller/products").end();

  // Check response status
  response.assertStatus(401);

  // check response content
  response.assertJSONSubset({
    message: "E_INVALID_JWT_TOKEN: jwt must be provided",
  });
});

test("products request ok", async ({ client }) => {
  const response = await client
    .get("/seller/products")
    .query({ user_id: 2, page: 1 })
    .header("authorization", "Bearer " + token)
    .end();

  // Check response status
  response.assertStatus(200);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");
});

test("different seller sales request", async ({ client }) => {
  const response = await client
    .get("/seller/sales")
    .query({ user_id: 5, page: 1 })
    .header("authorization", "Bearer " + token)
    .end();

  // Check response status
  response.assertStatus(401);

  // check response content
  response.assertJSON({
    message: "Unauthorized",
  });
});

test("sales request ok", async ({ client }) => {
  const response = await client
    .get("/seller/sales")
    .query({ user_id: 2, page: 1 })
    .header("authorization", "Bearer " + token)
    .accept("json")
    .end();

  // Check response status
  response.assertStatus(200);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");
});

test("inaccessible product sales count request", async ({ client }) => {
  const response = await client
    .get("/seller/sales-count")
    .query({ product_id: 20 })
    .header("authorization", "Bearer " + token)
    .accept("json")
    .end();

  // Check response status
  response.assertStatus(401);
});

test("sales count request ok", async ({ client }) => {
  const response = await client
    .get("/seller/sales-count")
    .header("authorization", "Bearer " + token)
    .accept("json")
    .end();

  // Check response status
  response.assertStatus(200);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");
});

test("register product price missing", async ({ client }) => {
  const response = await client
    .post("/seller/register-product")
    .send({
      name: "lámpara neón",
      stock: 12,
    })
    .header("authorization", "Bearer " + token)
    .accept("json")
    .end();

  // Check response status
  response.assertStatus(500);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");
  // check response content
  response.assertJSON({
    message: "Field 'price' doesn't have a default value",
  });
});

test("register product ok", async ({ client }) => {
  const response = await client
    .post("/seller/register-product")
    .send({
      name: "lámpara neón",
      price: 3000,
      stock: 12,
    })
    .header("authorization", "Bearer " + token)
    .accept("json")
    .end();

  // Check response status
  response.assertStatus(201);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");

  const product = await Product.find(response.body.id);
  await product.delete();
});

test("potential costumers request invalid date", async ({ client }) => {
  const response = await client
    .post("/seller/potential-customers")
    .send({
      initialDate: "aseriog",
      finalDate: "2020/12/23",
    })
    .header("authorization", "Bearer " + token)
    .accept("json")
    .end();

  // Check response status
  response.assertStatus(500);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");
  // check response content
  response.assertJSON({
    message: "Invalid date",
  });
});
