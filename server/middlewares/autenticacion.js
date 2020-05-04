const jwt = require('jsonwebtoken');

// ==================
// Verificar Token
// ==================

let verficaToken = ( req, res, next ) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if ( err ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario;

        next();

    });

};

// ==================
// Verificar Admin Role
// ==================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario

    if (!(usuario.role == "ADMIN_ROLE")) {

        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

    next();

}

module.exports = {
    verficaToken,
    verificaAdmin_Role
}