const express = require('express');

let { verficaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const bodyParser = require('body-parser');

const _ = require('underscore');

let app = express();

let Categoria = require('../models/categoria');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// ========================
// Mostrar todas las categorias
// ========================

app.get('/categoria', verficaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    categorias
                })
            })

        })

});

// ========================
// Mostrar una categoria por ID
// ========================

app.get('/categoria/:id', verficaToken, (req, res) => {
    // Categoria.findId
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto.'
                }
            });
        }

        res.json({
            ok: true,
            categoriaDB
        })


    })

});

// ========================
// Crear una categoria
// ========================

app.post('/categoria', verficaToken, (req, res) => {
    // Regresa la nueva categoria
    // req.usuario.id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id

    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });

});

// ========================
// Actualizar categoria
// ========================

app.put('/categoria/:id', verficaToken, (req, res) => {
    // Regresa la nueva categoria
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion 
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// ========================
// Eliminar categoria
// ========================

app.delete('/categoria/:id', [verficaToken, verificaAdmin_Role], (req, res) => {
    // Eliminar categoria completamente
    // administrador puede eliminar categorias
    // Categoria.findIdandremove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });


    });

});





module.exports = app;