"use strict";

const Purchase = use("App/Models/Purchase");
const { test, trait } = use("Test/Suite")("Customer endpoints");
trait("Test/ApiClient");

let token;

test("[Login] customer ok", async ({ client }) => {
  const response = await client
    .post("/authenticate")
    .send({
      email: "customer@gmail.com",
      password: "1234",
    })
    .end();

  token = response.body.token;
  // Check response status
  response.assertStatus(200);
});

test("products request ok", async ({ client }) => {
  const response = await client
    .get("/products")
    .header("authorization", "Bearer " + token)
    .end();

  // Check response status
  response.assertStatus(200);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");
});

test("different customer purchases request", async ({ client }) => {
  const response = await client
    .get("/purchases")
    .query({ user_id: 17, page: 1 })
    .header("authorization", "Bearer " + token)
    .end();

  // Check response status
  response.assertStatus(401);

  // check response content
  response.assertJSON({
    message: "Unauthorized",
  });
});

test("purchases request ok", async ({ client }) => {
  const response = await client
    .get("/purchases")
    .query({ user_id: 3, page: 1 })
    .header("authorization", "Bearer " + token)
    .accept("json")
    .end();

  // Check response status
  response.assertStatus(200);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");
});

test("make purchase product id missing", async ({ client }) => {
  const response = await client
    .post("/make-purchase")
    .header("authorization", "Bearer " + token)
    .accept("json")
    .end();

  // Check response status
  response.assertStatus(500);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");
  // check response content
  response.assertJSON({
    message: "Field 'product_id' doesn't have a default value",
  });
});

test("make purchase ok", async ({ client }) => {
  const response = await client
    .post("/make-purchase")
    .send({
      product_id: 5,
    })
    .header("authorization", "Bearer " + token)
    .accept("json")
    .end();

  // Check response status
  response.assertStatus(201);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");

  const purchase = await Purchase.find(response.body.id);
  await purchase.delete();
});
