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

test("unauthorized purchase details", async ({ client }) => {
  const response = await client
    .get("/seller/sale")
    .query({ purchase_id: 32 })
    .header("authorization", "Bearer " + token)
    .accept("json")
    .end();

  // Check response status
  response.assertStatus(401);
  // check response content
  response.assertJSON({
    message: "Unauthorized",
  });
});

test("purchase details ok", async ({ client }) => {
  const response = await client
    .get("/seller/sale")
    .query({ purchase_id: 30 })
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
      description: "tsutrfgkhlouys kytjshxjb jtdhfc",
      stock: 12,
      image_url: "https://picsum.photos/200/300",
    })
    .header("authorization", "Bearer " + token)
    .accept("json")
    .end();

  // Check response status
  response.assertStatus(400);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");
  // check response content
  response.assertJSON({
    price: "You must provide a price",
  });
});

test("register product ok", async ({ client }) => {
  const response = await client
    .post("/seller/register-product")
    .send({
      name: "lámpara neón",
      description: "tsutrfgkhlouys kytjshxjb jtdhfc",
      price: 3000,
      stock: 12,
      image_url: "https://picsum.photos/200/300",
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
  response.assertStatus(400);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");
  // check response content
  response.assertJSON({ initialDate: "The initial date must be a valid date" });
});

test("potential costumers request ok", async ({ client }) => {
  const response = await client
    .post("/seller/potential-customers")
    .send({
      initialDate: "06/05/2020",
      finalDate: "2020/12/23",
    })
    .header("authorization", "Bearer " + token)
    .accept("json")
    .end();

  // Check response status
  response.assertStatus(200);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");
});
