const User = require('../models/Users')

module.exports = {
    helloUser: async (req,res)=>{
        console.log(req.user)
        try{
            const receivedId = await req.params.uid
            //receivedID WAS received 
            console.log("receivedId " + receivedId);
            // const user = Users.findOne({firebase: receivedId});
            // const verifyId = user.firebase;
            const verifyId = "W1UCiMBG6ogdRIoe5SivAwzGnba2";
            if (receivedId === verifyId) {
                res.status(200).json("User verified!")
            }
        }catch(err){
            res.status(500).json(err)
        }
    },
    createUser: async (req,res)=>{
        try{
            const receivedId = await req.params.uid
            const date = await new Date();
            //receivedID WAS received 
            console.log("receivedId " + receivedId);
            // const user = Users.findOne({firebase: receivedId});
            // const verifyId = user.firebase;
            // const verifyId = "K3zo9YSEejSyTXLeD3PZflw96xD2";
            //This is receiving the params but returning a 500 and not creating the user object
            const user = await User.create({firebase: receivedId, lastDate: date});
            console.log(user + " user created!");
        }catch(err){
            res.status(500).json(err)
        }
    },
}    