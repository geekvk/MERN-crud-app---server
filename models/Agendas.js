import mongoose from 'mongoose';

const AgendaSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },

});

const AgendaModel = mongoose.model("agendas", AgendaSchema);

export default AgendaModel;