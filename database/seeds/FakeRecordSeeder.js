"use strict";

/*
|--------------------------------------------------------------------------
| FakeRecordSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Purchase = use("App/Models/Purchase");
const Product = use("App/Models/Product");
const User = use("App/Models/User");
const StoreMongo = use("App/MongoShemas/StoreSchema");
const mongoose = use("mongoose");

const manizales = {
  type: "Polygon",
  coordinates: [
    [
      [-75.54971694946289, 5.097227813325352],
      [-75.55126190185547, 5.092354793057999],
      [-75.5460262298584, 5.089832776834819],
      [-75.53194999694824, 5.0885931381172895],
      [-75.52817344665527, 5.0813262424459005],
      [-75.53791522979736, 5.073589045799894],
      [-75.53439617156982, 5.068630351650706],
      [-75.52795886993408, 5.065210540402276],
      [-75.52637100219727, 5.060508270396919],
      [-75.52860260009766, 5.055720469461602],
      [-75.53928852081299, 5.0523433385832455],
      [-75.53877353668213, 5.044734042504305],
      [-75.53229331970215, 5.040758363558085],
      [-75.52860260009766, 5.048666948253826],
      [-75.52345275878906, 5.049692919745151],
      [-75.5216932296753, 5.0566181848340825],
      [-75.51607131958008, 5.056318946514867],
      [-75.51465511322021, 5.054267022887036],
      [-75.51667213439941, 5.0496074221828735],
      [-75.5234956741333, 5.045973765367836],
      [-75.52413940429688, 5.0397323779437615],
      [-75.51547050476074, 5.037894149666418],
      [-75.50881862640381, 5.040672864818787],
      [-75.50169467926025, 5.040715614189848],
      [-75.49478530883789, 5.03605591619],
      [-75.48993587493896, 5.036226914872196],
      [-75.4856014251709, 5.033961178683759],
      [-75.48783302307129, 5.0266936697454625],
      [-75.48233985900879, 5.024727153383618],
      [-75.47961473464966, 5.029066306583756],
      [-75.4714822769165, 5.0288311807964945],
      [-75.45186996459961, 5.025069156655523],
      [-75.44521808624268, 5.0323366837282855],
      [-75.45328617095947, 5.0378086505502235],
      [-75.45860767364502, 5.036868159529867],
      [-75.47006607055664, 5.037295655616892],
      [-75.4737138748169, 5.043109574478257],
      [-75.4771900177002, 5.048880692448384],
      [-75.47637462615967, 5.056233449826834],
      [-75.46843528747559, 5.060337278116225],
      [-75.46706199645996, 5.064056350021847],
      [-75.47178268432617, 5.06397085435616],
      [-75.46933650970458, 5.069613544034437],
      [-75.47435760498047, 5.071195198206718],
      [-75.4766321182251, 5.068715846700002],
      [-75.48208236694336, 5.067005943564348],
      [-75.48465728759766, 5.072605859469878],
      [-75.4830265045166, 5.076752330784782],
      [-75.4859447479248, 5.081283495758197],
      [-75.48500061035156, 5.087310750723841],
      [-75.487961769104, 5.092055571311368],
      [-75.49148082733154, 5.090431222257302],
      [-75.49216747283936, 5.085087939855895],
      [-75.4945707321167, 5.076880571740765],
      [-75.49791812896729, 5.0804285614086915],
      [-75.50199508666992, 5.079445385504686],
      [-75.50452709197997, 5.072605859469878],
      [-75.50783157348633, 5.070340250486554],
      [-75.51122188568115, 5.075256184414257],
      [-75.509033203125, 5.087011526631017],
      [-75.51607131958008, 5.0867977950509715],
      [-75.51697254180908, 5.076324860747314],
      [-75.52268028259277, 5.082779628140287],
      [-75.52615642547607, 5.096800356885836],
      [-75.53868770599365, 5.101160399218969],
      [-75.54207801818848, 5.093765407987767],
      [-75.54971694946289, 5.097227813325352],
    ],
  ],
};

class FakeRecordSeeder {
  async run() {
    mongoose.connect("mongodb://localhost/taxia-technical", {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    try {
      await db.dropCollection("stores");
    } catch (error) {}
    await User.create({
      id: 1,
      username: "admin",
      email: "admin@gmail.com",
      password: "1234",
      roles: "admin,customer,seller",
    });
    const seller = await User.create({
      id: 2,
      username: "seller",
      email: "seller@gmail.com",
      password: "1234",
      roles: "seller",
    });
    const sellerStore = await Factory.model("App/Models/Store").make();
    await seller.store().save(sellerStore);
    StoreMongo.create({ store_id: sellerStore.id, location: manizales });
    for (let j = 0; j < 10; j++) {
      const product = await Factory.model("App/Models/Product").make();
      await sellerStore.products().save(product);
    }
    const customer = await User.create({
      id: 3,
      username: "customer",
      email: "customer@gmail.com",
      password: "1234",
      roles: "customer",
    });
    for (let i = 0; i < 4; i++) {
      const user = await Factory.model("App/Models/User").create();
      const store = await Factory.model("App/Models/Store").make();
      await user.store().save(store);
      StoreMongo.create({ store_id: store.id, location: manizales });
      const random = Math.random() * (6 - 3) + 3;
      for (let j = 0; j < random; j++) {
        const product = await Factory.model("App/Models/Product").make();
        await store.products().save(product);
      }
    }
    for (let j = 0; j < 30; j++) {
      const product = await Product.find(
        Math.floor(Math.random() * (10 - 1) + 1)
      );
      const day = Math.floor(Math.random() * (28 - 1) + 1);
      const month = Math.floor(Math.random() * (12 - 1) + 1);
      const date = "2020/" + month + "/" + day;
      const purchase = {
        user_id: customer.id,
        product_id: product.id,
        transaction_date: date,
        address:
          "Cra. " +
          day +
          " # " +
          month +
          "-" +
          day * 2 +
          " , Manizales, Caldas, Colombia",
      };
      try {
        await Purchase.create(purchase);
        product.stock = product.stock + 1;
        await product.save();
      } catch (error) {}
    }
    for (let i = 0; i < 8; i++) {
      const user = await Factory.model("App/Models/User").make();
      user.roles = "customer";
      await user.save();
      const random = Math.random() * (20 - 10) + 10;
      for (let j = 0; j < random; j++) {
        const product = await Product.find(
          Math.floor(Math.random() * (22 - 1) + 1)
        );
        const day = Math.floor(Math.random() * (28 - 1) + 1);
        const month = Math.floor(Math.random() * (12 - 1) + 1);
        const date = "2020/" + month + "/" + day;
        const purchase = {
          user_id: user.id,
          product_id: product.id,
          transaction_date: date,
          address:
            "Cra. " +
            day +
            " # " +
            month +
            "-" +
            day * 2 +
            " , Manizales, Caldas, Colombia",
        };
        try {
          await Purchase.create(purchase);
          product.stock = product.stock + 1;
          await product.save();
        } catch (error) {}
      }
    }
    await mongoose.connection.close();
  }
}

module.exports = FakeRecordSeeder;
