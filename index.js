require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
// app.use(cors({origin:['https://cineverse-9ca24.web.app']}));
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6s1yf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const userCollection = client.db("CineVerseDB").collection("users");
const movieCollection = client.db("CineVerseDB").collection("movies");
const favoriteCollection = client.db("CineVerseDB").collection("favorites");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // create user
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    // add movies to db
    app.post("/movies", async (req, res) => {
      const newMovie = req.body;
      const result = await movieCollection.insertOne(newMovie);
      res.send(result);
    });

    // get all movies
    app.get("/movies", async (req, res) => {
      const result = await movieCollection.find().toArray();
      res.send(result);
    });

    // get one
    app.get("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.findOne(query);

      res.send(result);
    });

    // get filtered based (featured-movies)
    app.get("/featured-movies/featured", async (req, res) => {
      const query = { rating: { $gt: 3 } };
      const result = await movieCollection
        .find(query)
        .sort({ rating: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    // get filtered based (action-movies)
    app.get("/action-movies/action", async (req, res) => {
      const query = { genre: { $eq: "Action" } };
      const result = await movieCollection.find(query).limit(20).toArray();
      res.send(result);
    });

    // get filtered based (romantic-movies)
    app.get("/romantic-movies/romantic", async (req, res) => {
      const query = { genre: { $eq: "Romantic" } };
      const result = await movieCollection.find(query).limit(20).toArray();
      res.send(result);
    });

    // get filtered based (comdedy-movies)
    app.get("/comedy-movies/comedy", async (req, res) => {
      const query = { genre: { $eq: "Comedy" } };
      const result = await movieCollection.find(query).limit(20).toArray();
      res.send(result);
    });

    // get filtered based (drama-movies)
    app.get("/drama-movies/drama", async (req, res) => {
      const query = { genre: { $eq: "Drama" } };
      const result = await movieCollection.find(query).limit(20).toArray();
      res.send(result);
    });

    // get filtered based (horror-movies)
    app.get("/horror-movies/horror", async (req, res) => {
      const query = { genre: { $eq: "Horror" } };
      const result = await movieCollection.find(query).limit(20).toArray();
      res.send(result);
    });

    // get filtered based (science-fiction-movies)
    app.get("/science-fiction-movies/fiction", async (req, res) => {
      const query = { genre: { $eq: "Science Fiction" } };
      const result = await movieCollection.find(query).limit(20).toArray();
      res.send(result);
    });

    // get filtered based (thriller-movies)
    app.get("/thriller-movies/thriller", async (req, res) => {
      const query = { genre: { $eq: "Thriller" } };
      const result = await movieCollection.find(query).limit(20).toArray();
      res.send(result);
    });

    // add to favorite
    app.post('/favorites', async (req, res) => {
      const { email, title } = req.body;
      // const existingFavorite = await favoriteCollection.findOne({ email, title });
      // if (existingFavorite) {
      //     return res.status(400).json({ message: 'Movie already in favorites.' });
      // }
      const result = await favoriteCollection.insertOne({ email, title });
      console.log(result);
      
      res.send(result);
    })


    // get favorites
    app.get('/favorites', async (req, res) => {
      const { email } = req.query;
  
      if (!email) {
          return res.status(400).json({ error: 'Email is required.' });
      }
      const favorites = await favoriteCollection.find({ email }).toArray();
      console.log(favorites);
      res.send(favorites);
      
  });
  
  // module.exports = router;
  


    // update details
    // app.put("/movies/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true };
    //   const updateMovie = req.body;
    //   const movie = {
    //     $set: {
    //       title: updateMovie.title,
    //       duration: updateMovie.chef,
    //       genre: updateMovie.genre,
    //       poster: updateMovie.poster,
    //       rating: updateMovie.rating,
    //       releaseYear: updateMovie.releaseYear,
    //       summary: updateMovie.summary,
    //     },
    //   };
    //   const result = await movieCollection.updateOne(filter, movie, options);
    //   res.send(result);
    // });

    // add to favourite



    

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("CineVerse Movie Server");
});

app.listen(port, () => {
  console.log(`This server is running on port ${port}`);
});
