import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Configurar strictQuery para evitar warnings
mongoose.set('strictQuery', false);

const connectionDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`✅ MongoDB conectado desde: ${url}`);
  } catch (error) {
    console.error(`❌ Error conectando a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectionDb;
