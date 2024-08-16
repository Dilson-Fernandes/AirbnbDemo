const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://noslid:aNbQdyV5J7PvCSHa@cluster0.5pn1tal.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj , owner:"66ace1e81d6a1cf33a068810"}))
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();