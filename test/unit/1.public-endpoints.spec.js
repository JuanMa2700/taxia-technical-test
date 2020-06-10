"use strict";

const User = use("App/Models/User");
const { test, trait } = use("Test/Suite")("Public endpoints");
trait("Test/ApiClient");

test("[Login] Wrong email", async ({ client }) => {
  // Send request to API with invalid email
  const response = await client
    .post("/authenticate")
    .send({
      email: "bad_email@example.com",
      password: "password",
    })
    .end();
  // Check response status
  response.assertStatus(401);

  // check response content
  response.assertJSONSubset({ message: "Invalid Email" });
});

test("[Login] Wrong password", async ({ client }) => {
  // Send request to API with invalid password
  const response = await client
    .post("/authenticate")
    .send({
      email: "admin@gmail.com",
      password: "password",
    })
    .end();
  // Check response status
  response.assertStatus(401);

  // check response content
  response.assertJSONSubset({ message: "Invalid Password" });
});

test("[Login] ok", async ({ client }) => {
  const response = await client
    .post("/authenticate")
    .send({
      email: "admin@gmail.com",
      password: "1234",
    })
    .end();

  // Check response status
  response.assertStatus(200);
});

test("customer registration username alredy in use", async ({ client }) => {
  const response = await client
    .post("/register")
    .send({
      username: "customer",
      email: "customer@gmail.com",
      password: "1234",
    })
    .accept("json")
    .end();

  // Check response status
  response.assertStatus(500);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");
  // check response content
  response.assertJSON({
    message: "Duplicate entry 'customer' for key 'users_username_unique'",
  });
});

test("customer registration ok", async ({ client }) => {
  const response = await client
    .post("/register")
    .send({
      username: "Customer test",
      email: "test-customer@gmail.com",
      password: "1234",
    })
    .accept("json")
    .end();

  // Check response status
  response.assertStatus(201);
  // Chek response content
  response.assertHeader("content-type", "application/json; charset=utf-8");

  const user = await User.find(response.body.id);
  await user.delete();
});
