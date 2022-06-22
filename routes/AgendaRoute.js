import express from 'express';
import AgendaModel from "../models/Agendas.js";
import multer from 'multer';
import XLXS from 'xlsx';

export const fileUpload = async(req, res) => {
    try{
        const file = req.file;
        console.log(file)
        res.status(201).send("File is uploaded");
    }catch(err){
        res.status(400).send(err.message);
    }
}
export const convertCSVTOJSON = async(req, res) => {
    var workbook = XLXS.readFile(req.file.path);
    var sheet = workbook.SheetNames;
    var x=0;
    sheet.forEach(element => {
        var xlData = XLXS.utils.sheet_to_json(workbook.Sheets[sheet[x]]);
        AgendaModel.insertMany(xlData, (err, data) => {
            if(err){
                console.log(err);
            }
            else{
                console.log(data);
            }
        })
        x++;
    })
}
const storage = multer.diskStorage({
    destination:(req,file, cb) => {
        cb(null, './public');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({storage:storage});
const router = express.Router();

router.route('/').get((req, res) => {
     AgendaModel.find({}, (err, result) => {
        if(err){
            res.json(err);
        }else{
             res.json(result);
        }
    })
});
router.route('/:id').get(async(req, res) => {
    try{
        const {id} = req.params;
        const agenda = await AgendaModel.findById(id);
        if(!agenda) return res.sendStatus(404);
        return res.json(agenda);
    }catch(err){
        return res.status(500).json(err);
    }
})
router.route("/add").post((req, res) => {
            const agenda = req.body;
            const newAgenda = new AgendaModel(agenda);
            newAgenda.save();
            res.json(agenda);     
});

router.route('/upload').post(upload.single('file'),  convertCSVTOJSON);

router.route('/download').get(async(res, req) => { 
    try{
        const file = './public/Agenda Doc.csv';
        res.download(file);
        console.log('downloaded');
    }catch(err){
        console.log(err);
    }
})

router.route('/delete/:id').delete((req, res) => {
    let itemID = req.params.id;
    AgendaModel.findByIdAndRemove(itemID).exec();
    res.send("Deleted");
})

export default router;