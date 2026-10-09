const User = require("../models/User")
const OTP = require("../models/OTP")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const { sendOTPEmail } = require("../utils/email");


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body
        const existUser =await User.findOne({ email })
        if (existUser) {
            return res.status(400).json({ message: "User is Already Exists." })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

    const    user = await User.create({
            username,
            email, password: hashPassword,
            role: "user",
            isVerified: false
        })

        const otp = generateOTP()
        await OTP.create({ email, otp, action: 'account_verification' });
        await sendOTPEmail(email, otp, 'account_verification');

        console.log(`Your OTP is ${otp}`);
        

        res.status(201).json({
            message: 'OTP sent to email. Please verify.',
            email: user.email,
            
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

//login
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User is not Exists" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "EnCorrect password.." })
        }

        if (!user.isVerified && user.role !== 'admin') {
            const otp = generateOTP();
            await OTP.findOneAndDelete({ email: user.email, action: 'account_verification' });//Remove old OTPs
            await OTP.create({ email: user.email, otp, action: 'account_verification' });
            await sendOTPEmail(user.email, otp, 'account_verification');
            return res.status(403).json({ message: 'Account not verified', needsVerification: true, email: user.email });
        }

        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

//Verify OTP
const verifyOtp = async (req,res) => {
      try {
        const { email, otp } = req.body;
        const validOTP = await OTP.findOne({ email, otp, action: 'account_verification' });

        if (!validOTP) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
        await OTP.deleteOne({ _id: validOTP._id }); // Delete OTP after usage

        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { register, login,verifyOtp}