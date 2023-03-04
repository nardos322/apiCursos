import jwt from 'jsonwebtoken';

export const verifyTokekAdmin = (req, res, next) => {
    try {
        const token = req.header('auth-token');
        if (!token) return res.status(401).json({
            message: 'acceso denegado',
        });
    
        const payload = jwt.verify(token, process.env.SECRET_KEY);
    
        if(payload.rol == 2) return res.status(400).json({
            message: 'no tienes permisos para realizar esta accion'
        })

        next()
    } catch (err){
        return res.status(404).json({
            message: 'token invalido'
        })
    }
    

    

}    