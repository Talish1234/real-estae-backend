import jwt from 'jsonwebtoken';
import prisma from './../lib/prisma.js';

export const getPosts = async (req,res) => {
    try {
        const query = req.query;
        const posts = await prisma.post.findMany({
            where:{
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                bedroom: parseInt(query.bedroom) || undefined,
                price:{
                    gte: parseInt(query.minPrice) || 0,
                    lte: parseInt(query.maxPrice) ||  100000000            }
            }
        });
        res.status(200).json({
        posts,
        error:false,
        success:true
        })
    } catch (err) {
        res.status(500).json({
            message:err.message,
            error:true,
            success:false
        })
    }
}
export const getPost = async (req,res) => {
    try {
        const id  = req.params.id;
        const post = await prisma.post.findUnique({
            where:{
                id
            },
            include:{
            postDetails:true,
            user:{
                select:{
                    id:true,
                    username:true,
                    avatar:true
                }
            }
            }
        })

        let userId = null;
        const token = req.cookies.token;
        if(token){
        jwt.verify(token,process.env.JWT_SECRET, async (error,payload) => {
            if(error)
            userId = null;
            else
            userId = payload.id;
        })}
       
        let saved = null;
        if(userId != null)
        saved = await prisma.savedPost.findUnique({
            where:{
                userId_postId:{
                    postId:id,
                    userId
                }
            }
        })
    
        
        res.status(200).json({
        post:{...post,
            isSaved: saved?true:false},
        error:false,
        success:true
        })
    } catch (err) {
        res.status(500).json({
            message:err.message,
            error:true,
            success:false
        })
    }
}

export const addpost = async (req,res) => {
    try {
        const TokenUserId = req.userId;
        const body = req.body;
        const newPost = await prisma.post.create({
            data:{
                ...body.postData,
                userId:TokenUserId,
                postDetails:{
                create:body.postDetails,
                }

            }
        })
        res.status(200).json({
        newPost,
        error:false,
        success:true
        })
    } catch (err) {
        res.status(500).json({
            message:err.message,
            error:true,
            success:false
        })
    }
}
export const updatePost = async (req,res) => {
    try {

        res.status(200).json({
        error:false,
        success:true
        })
    } catch (err) {
        res.status(500).json({
            message:err.message,
            error:true,
            success:false
        })
    }
}

export const deletePost = async (req,res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const post  = await prisma.post.findUnique({
            where:{
                id
            }
        })
        if(!post || userId != post.userId)
        throw new Error("user is not Authorized");
        
        await prisma.post.delete({
            where:{
                id
            }
        })
        res.status(200).json({
        error:false,
        success:true
        })
    } catch (err) {
        res.status(500).json({
            message:err.message,
            error:true,
            success:false
        })
    }
}

