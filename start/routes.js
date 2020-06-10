"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

// --------------------->> Public routes <<----------------------- //

Route.post("/authenticate", "UserController.login");
Route.post("/register", "UserController.createCustomer");

// --------------------->> Admin routes <<------------------------ //
Route.group(() => {
  Route.get("/users", "UserController.index");
  Route.post("/register-seller", "UserController.createSeller");
})
  .prefix("admin")
  .middleware(["auth", "authorized:admin"]);

// -------------------->> Customer routes <<---------------------- //

Route.group(() => {
  Route.get("/products", "ProductController.availableProducts");
  Route.get("/purchases", "PurchaseController.customerPurchases");
  Route.post("/make-purchase", "PurchaseController.makePurchase");
}).middleware(["auth", "authorized:customer"]);

// -------------------->> Seller routes <<------------------------ //

Route.group(() => {
  Route.get("/products", "ProductController.sellerProducts");
  Route.get("/sales", "PurchaseController.sellerSales");
  Route.get("/sales-count", "ProductController.salesCount");
  Route.post("/register-product", "ProductController.registerProduct");
  Route.post("/potential-customers", "UserController.potentialCustomers");
})
  .prefix("seller")
  .middleware(["auth", "authorized:seller"]);

// ------------------->> Shared routes <<------------------------- //

Route.get("/purchase", "PurchaseController.purchaseDetails").middleware([
  "auth",
  "authorized:seller,customer",
]);
