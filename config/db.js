import mongoose from "mongoose";

const connectDB = async () => {
try {
    mongoose.connection.on('connected', ()=> console.log('db is connected'));
    await mongoose.connect(`${process.env.MONGODB_URI}/BookMovie-Ticket`)
} catch (error) {
    console.log('message of db', error);
    
}
}

export default connectDB;