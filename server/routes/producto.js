const express = require('express');

const { verficaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// ==================================
// Obtener productos
// ==================================

app.get('/productos', verficaToken, (req, res) => {
    // Trae todos los productos
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.countDocuments({}, (err, conteo) => {

                res.json({
                    ok: true,
                    cuantos: conteo,
                    productos
                })

            })

        })


});


// ==================================
// Obtener producto por ID
// ==================================

app.get('/productos/:id', verficaToken, (req, res) => {
    // populate: usuario categoria

    let id = req.params.id;

    Producto.find({ _id: id })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto.'
                    }
                });
            }

            res.json({
                ok: true,
                productoDB
            })

        })


});


// ==================================
// Buscar productos
// ==================================

app.get('/productos/buscar/:termino', verficaToken, (req, res) => {

    let termino = req.params.termino;

    let  regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        });

    });


});

// ==================================
// Crear un nuevo producto
// ==================================

app.post('/productos', verficaToken, (req, res) => {
    // Grabar el usuario
    // Grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    });

});

// ==================================
// Actualizar un nuevo producto
// ==================================

app.put('/productos/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let actualizar_producto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    }

    Producto.findByIdAndUpdate(id, actualizar_producto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto.'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    });

});

// ==================================
// Borrar un nuevo producto
// ==================================

app.delete('/productos/:id', (req, res) => {
    // disponible a falso

    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    }


    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoNoDisponible) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoNoDisponible) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado.'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoNoDisponible,
            message: 'Producto borrado.'
        });

    });

});



module.exports = app;