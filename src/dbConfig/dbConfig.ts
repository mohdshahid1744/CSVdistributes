import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.Mongo_URL!)
        const connection=mongoose.connection
        connection.on('Connected',(err)=>{
            console.log('MongoDB connected successfully.Please make sure MongoDB is running.'+ err);
            process.exit()
        })
    } catch (error) {
        console.log('Something went wrong');
        console.error(error);
        
        
    }
}