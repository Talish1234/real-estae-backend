import prisma from "../lib/prisma.js"
import bcrypt from 'bcryptjs';
export const getUsers = async (req,res) => {
    try{
        const user = await prisma.user.findMany();
    res.status(200).json({
        data:{
            user
        },
        error:false,
        success:true
    })
    }catch(err){
        res.status(500).json({
            message:err.message,
            error:true,
            success:false
        })
    }
}

export const getUser = async (req,res) => {
    try{
        const id = req.params.id;
        const user = await prisma.user.findUnique({
            where:{
                id
            }
        });
    res.status(200).json({
        user,
        error:false,
        success:true
    })
    }catch(err){
        res.status(500).json({
            message:err.message,
            error:true,
            success:false
        })
    }
}


export const updateUser = async (req,res) => {
    try{
    const id = req.params.id;
    const tokenUserId = req.userId;
    const {password,avatar,...input} = req.body;
    if(id != tokenUserId)
     throw new Error('Not Authorized');
     
    let updatedPassword = null;
    if(password)
     updatedPassword = await bcrypt.hash(password,10);
     
    const updatedUser = await prisma.user.update({
        where:{
        id
        },
        data:{
        ...input,
        ...(updatedPassword && {password:updatedPassword}),
        ...(avatar && {avatar})
        }
    })
    const {password:userPassword,...rest} = updatedUser;
    res.status(200).json({
        user:rest,
        error:false,
        success:true
    })
    }catch(err){
        res.status(500).json({
            message:err.message,
            error:true,
            success:false
        })
    }
}

export const deleteUser = async (req,res) => {
    try{
        const id = req.params.id;
        const tokenUserId = req.userId;
        const {password, ...input} = req.body;
        if(id != tokenUserId)
         throw new Error('Not Authorized');
        await prisma.user.delete({
            where:{
                id
            }
        });   
        res.status(200).json({
            error:false,
            success:true
        }) 
    }catch(err){
        res.status(500).json({
            message:err.message,
            error:true,
            success:false
        })
    }
}

export const savePost = async (req,res) => {
    try {
        const postId = req.body.postId;
        const TokenUserId = req.userId;
        const resSavedPost = await prisma.savedPost.findUnique({
            where:{
                userId_postId:{
                    userId:TokenUserId,
                    postId:postId
                }
            }
        })

        if(resSavedPost){
            await prisma.savedPost.delete({
                where :{
                    id: resSavedPost.id,
                }
            })
            res.status(200).json({
                message:"post removed from saved list"
            })
        }
        else {
            await prisma.savedPost.create({
                data:{
                    userId:TokenUserId,
                    postId:postId
                }
            })

        res.json({
            message:"saved successfully"
        })
        }

    } catch (err) {
        res.status(500).json({
            message:err.message,
            error:true,
            success:false
        })
    }
}

export const profilePosts = async (req,res) => {
    
    const tokenUserId = req.userId;
    try {
        const userPosts = await prisma.post.findMany({
            where:{
                userId:tokenUserId
            }
        });
        const saved = await prisma.savedPost.findMany({
            where:{
                userId:tokenUserId,
            },
            include:{
                post:true
            }
        });
        const savePost = saved.map(item => item.post);
        res.status(200).json({
        userPosts,
        savePost
        });

    } catch (err) {
      res.status(500).json({
      message:"Failed to get profile post"
      });       
    }
}



export const getNotification = async (req, res) => {
    const tokenUserId = req.userId;
    try {
      const number = await prisma.chat.count({
        where: {
          userIDs: {
            hasSome: [tokenUserId],
          },
          NOT: {
            seenBy: {
              hasSome: [tokenUserId],
            },
          },
        },
      });
      res.status(200).json(number);
    } catch (err) {
      res.status(500).json({ message: "Failed to get profile posts!" });
    }
  };
