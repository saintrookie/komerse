import nc from "next-connect";
import bcrypt from "bcrypt";
import User from "../../../models/User";
import db from "../../../utils/db";
import { signToken } from "../../../utils/auth";

const handler =  nc();

handler.post(async (req, res) => {
    await db.connect();
    const user = await User.findOne({email: req.body.email});
    const match = await bcrypt.compare(req.body.password, user.password);
    await db.disconnect();
    if(user === ''){
        res.status(401).send({ message:'Not Authorized' });
    }
    if(user && match) {
        const token = signToken(user);
        res.send({
            token,
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            isAdmin: user.isAdmin,
        });
    }else{
        res.status(401).send({ message:'Invalid E-mail or Password' });
    }
});

export default handler;