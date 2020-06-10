"use strict";

const User = use("App/Models/User");
const { test, trait } = use("Test/Suite")("Admin endpoints");
trait("Test/ApiClient");

let token;

test("[Login] admin ok", async ({ client }) => {
  const response = await client
    .post("/authenticate")
    .send({
      email: "admin@gmail.com",
      password: "1234",
    })
    .end();

  token = response.body.token;
  // Check response status
  response.assertStatus(200);
});

test("users request ok", async ({ client }) => {
  const response = await client
    .get("/admin/users")
    .header("authorization", "Bearer " + token)
    .end();

  // Check response status
  response.assertStatus(200);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");
});

test("create seller email alredy in use", async ({ client }) => {
  const response = await client
    .post("/admin/register-seller")
    .send({
      username: "Jose Zuñiga",
      email: "seller@gmail.com",
      password: "1234",
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
    message: "Duplicate entry 'seller@gmail.com' for key 'users_email_unique'",
  });
});

test("create seller ok", async ({ client }) => {
  const response = await client
    .post("/admin/register-seller")
    .send({
      username: "Jose Zuñiga",
      email: "test-seller@gmail.com",
      password: "1234",
    })
    .header("authorization", "Bearer " + token)
    .accept("json")
    .end();

  // Check response status
  response.assertStatus(201);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");

  const user = await User.find(response.body.id);
  await user.delete();
});
