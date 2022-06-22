import express from 'express';
import mongoose from 'mongoose';
import agendaRouter from './routes/AgendaRoute.js'
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import XLXS from 'xlsx';
import AgendaModel from './models/Agendas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use("/agendas/upload", express.static(path.join(__dirname, 'public')));



app.get('/download', (req, res) => {
    // res.download('./public/Agenda Doc.csv');
    var wb = XLXS.utils.book_new();
    AgendaModel.find((err, data) => {
        if(err){
            console.log(err);
        }
        else{
            var temp = JSON.stringify(data);
            temp = JSON.parse(temp);
            var ws = XLXS.utils.json_to_sheet(temp);
            var down = './public/AgendaList.csv'
            XLXS.utils.book_append_sheet(wb,ws,'Sheet1');
            XLXS.writeFile(wb,down);
            res.download(down);
        }
    })
});

app.listen(PORT, () => {
    console.log(`SERVER RUNS ${PORT}`);
});