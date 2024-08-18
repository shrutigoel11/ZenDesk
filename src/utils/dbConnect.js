async function dbConnect() {
    if (connection.isConnected) {
      console.log('Using existing database connection');
      return;
    }
  
    try {
      const db = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      connection.isConnected = db.connections[0].readyState;
      console.log('New database connection established');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }