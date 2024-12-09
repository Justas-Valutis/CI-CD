// index.js
const express = require('express'); // Import Express
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000; // Set the port
const mongoose = require('mongoose');

app.use(express.json());
app.use(cors());

function connectDB() {
    mongoose.connect('process.env.MONGO_URI')
        .then(() => console.log('Connected to MongoDB!'))
        .catch(err => console.error("Error connecting to DB :", err))
}
// TimeOut for docker-compose to give mongo container time to start up
setTimeout(connectDB, 3000)

const foodSchema = new mongoose.Schema({
    name: String,
    color: String,
}
);

const Food = mongoose.model('Food', foodSchema);

// Route for the home page
app.get('/', async (req, res) => {
    try {
        const foods = await Food.find();
        res.send(foods);
    }
    catch (error) {
        console.error(error);
    }
});

// Seed Function
async function seedFoods() {
    // Define five foods with name and color
    const foods = [
      { name: "Apple", color: "Red" },
      { name: "Banana", color: "Yellow" },
      { name: "Grapes", color: "Purple" },
      { name: "Orange", color: "Orange" },
      { name: "Lettuce", color: "Green" },
    ];
  
    try {
      //empty the DB
      await Food.deleteMany({});
      // Insert foods
      await Food.insertMany(foods);
      console.log("Foods seeded successfully:", foods);
    } catch (error) {
      console.error("Error seeding foods:", error);
    }
    
  }
  
  // Run the seed function
  seedFoods();

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
