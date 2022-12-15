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
            const verifyId = "WHWeU8n5H1aS10avca9n3jQQqaMX2";
            if (receivedId === verifyId) {
                // res.status(200).json("User verified!")
                console.log("User " + receivedId + " verified!")
            }
        }catch(err){
            res.status(500).json(err)
        }
    },
    createUser: async (req,res)=>{
        try{
            const receivedId = await req.params.uid
            // const date = await new Date();
            //receivedID WAS received 
            console.log("receivedId " + receivedId);
            // const user = Users.findOne({firebase: receivedId});
            // const verifyId = user.firebase;
            // const verifyId = "K3zo9YSEejSyTXLeD3PZflw96xD2";
            //This is receiving the params but returning a 500 and not creating the user object
            //removing await, and new error as seen below
            const user = User.create({firebase: receivedId});
            console.log(user + " user created!");
        }catch(err){
            res.status(500).json(err)
        }
    },
    //test route

}    