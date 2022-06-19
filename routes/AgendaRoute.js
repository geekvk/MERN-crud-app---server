import express from 'express';
import AgendaModel from "../models/Agendas.js";

const router = express.Router();

router.route('/').get ((req, res) => {
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


router.route('/update/:id').put(async(req, res) => {
    let itemID = req.params.id;
    const { title } = req.body;

    const updateItem = {
        title,
    }
    const update = await AgendaModel.findByIdAndUpdate(itemID, updateItem).then(() => {
        res.status(200).send({status: "item updated", item: update});
    }).catch((err) => {
        res.json(err);
    })
});

router.route('/delete/:id').delete((req, res) => {
    let itemID = req.params.id;
    AgendaModel.findByIdAndRemove(itemID).exec();
    res.send("Deleted");
})

export default router;