import express from 'express';
import mongoose from 'mongoose';
import agendaRouter from './routes/AgendaRoute.js'
import cors from 'cors';

const PORT = process.env.PORT || 8001;
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://admin_v:i6tGUbx1ZlaAWgBx@cluster0.ioy2icn.mongodb.net/agendaDB?retryWrites=true&w=majority",{
    useNewUrlParser: true,

}) 
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("mongoDB is connected");
})
// api end points
app.use("/agendas", agendaRouter);

app.listen(PORT, () => {
    console.log(`SERVER RUNS ${PORT}`);
});