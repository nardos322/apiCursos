import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {

        const token = req.header('auth-token');
        if (!token) return res.status(401).json({
            message: 'acceso denegado',
        })

        const payload = jwt.verify(token, process.env.SECRET_KEY);
        console.log(payload)
        req.userId = payload.id;


        next();
    } catch (err) {
        return res.status(404).json({
            message: 'token invalido'
        })

    }




}


