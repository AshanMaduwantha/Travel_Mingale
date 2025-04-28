import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (req, res) => {
    
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {

        const existingUser = await userModel.findOne({
            email
        });
        
        if(existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        //Sending welcome email to the user
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to our website',
            text: `Hello ${email}, welcome to our website.`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'User registered successfully' });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const login = async (req, res) => {

    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {

        const user = await userModel.findOne({
            email
        });

        if(!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.json({ success: true, message: 'User logged in successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}


export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });
        
        return res.json({ success: true, message: 'Logged out' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//Send verification OT to the user
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userID } = req.body;

        if (!userID) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const user = await userModel.findById(userID);

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: 'Account already verified' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verification OTP',
           // text: `Your account verification OTP is ${otp}`,
           html : EMAIL_VERIFY_TEMPLATE.replace('{{otp}}', otp).replace('{{email}}', user.email)
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'OTP sent successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//Verify email using OTP
export const verifyEmail = async (req, res) => {

    const {userID, otp} = req.body;

    if(!userID || !otp){
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try{
        const user = await userModel.findById(userID);

        if(!user){
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.status(400).json({ success: false, message: 'OTP expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        res.json({ success: true, message: 'Email verified successfully' });

    }catch(error){
        res.status(500).json({ success: false, message: error.message }); 
    }

}

//Check if user is authenticated
export const isAuthenticated = async (req, res) => {

    try{
        return res.json({ success: true, message: 'User Authenticated' });
    }catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
}

//send password reset Otp
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if(!email){
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try{

        const user = await userModel.findOne({ email});
        if(!user){
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password reset OTP',
           // text: `Your password reset OTP is ${otp}`,
           html : PASSWORD_RESET_TEMPLATE.replace('{{otp}}', otp).replace('{{email}}', user.email)
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'Reset OTP sent successfully' });


    }catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
}

//Reset User password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if(!email || !otp || !newPassword){
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try{

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.status(400).json({ success: false, message: 'OTP expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Password reset successfully' });

    }catch(error){
        res.status(500).json({ success: false, message: error.message });
    }


}