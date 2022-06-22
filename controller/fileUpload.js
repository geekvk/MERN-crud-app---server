export const fileUpload = async(req, res) => {
    try{
        const file = req.file;
        res.status(201).send('File is uploaded');
    }catch(err){
        res.status(400).send(err.message);
    }
}
