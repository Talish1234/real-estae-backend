import prisma from './../lib/prisma.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            throw new Error('Provide email or password')
        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
        res.status(201).json({
            message: "user created successfully",
            success: true,
            error: false,
        })
    } catch (err) {
        res.status(500).json({
            message: err.message,
            success: false,
            error: true,
        })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if (!user)
            throw new Error('User does not exist');

        const ispassword = await bcryptjs.compare(password, user.password);
        if (!ispassword)
            throw new Error('Worng password');
        const { password: userPassword, ...userInfo } = user;
        const token = jwt.sign({
            id: user.id,
            isAdmin:true
        }, process.env.JWT_SECRET, { expiresIn: 1000 * 60 * 60 * 24 * 7 });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }).status(200).json({
            token,
            userInfo,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
            error: true,
            success: false
        })
    }
}

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({
        message: "Logout successfully",
        error: "false",
        success: "true"
    });
}
