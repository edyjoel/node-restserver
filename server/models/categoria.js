const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripcion de la categoria es necesaria'],
        unique: true
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }


});

categoriaSchema.plugin( uniqueValidator, { message: '{PATH} de la categoria ya se encuentra en uso.' } )


module.exports = mongoose.model('Categoria', categoriaSchema);

