import jwt from 'jsonwebtoken';

export const verifyToken = async (req,res,next) => {

    const token = req.cookies.token;
    if(!token)
    res.status(401).json({
    message:'Not Authenticated!',
    error:true,
    success:false});

    jwt.verify(token, process.env.JWT_SECRET, async (err,payload)=> {

    if(err)
    res.status(401).json({
        message:'Token in not valid',
        error:true,
        success:false});
    req.userId = payload.id;
    next();
    })
}
