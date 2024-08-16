import jwt from 'jsonwebtoken';
export const shouldBeLoggedIn = async (req,res)=> {

    res.status(200).json({
        message:'You are Authenticated',
        error:false,
        success:true,
    });
}

export const shouldBeAdmin = async (req,res) => {
     
    try{
        const token = req.cookies.token;
    if(!token)
     throw new Error('Not Authenticated!');

    jwt.verify(token, process.env.JWT_SECRET, async (err,payload)=> {
    
    if(err)
     throw new Error('Token in not valid');
    if(!payload.isAdmin)
     throw new Error('You are not admin')
    })

    res.status(200).json({
        message:'You are not Authenticated',
        error:false,
        success:true,
    });
       }catch(err){
        res.status(500).json({
            message:err.message,
            error:true,
            success:false
        })
       }
}

