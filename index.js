const express=require('express')
const app=express();
const jwt=require("jsonwebtoken")
const users=[
    {
        id:"1",
        username:'john',
        password:'Jhon0908',
        isAdmin:true,
    },
    {
        id:"2",
        username:'jane',
        password:'Jane0908',
        isAdmin:false,
    },
]
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.post("/api/login",(req,res)=>{
   
    const {username,password}=req.body;
    const user=users.find(u=>{
        return u.username===username && u.password===password;
    })
   if(user){
    //    res.json(user)
    const accessToken=jwt.sign({id:user.id,isAdmin:user.isAdmin},"secretkey",{expiresIn:"60s"});
    res.json({
        username:user.username,
        isAdmin:user.isAdmin,
        accessToken,
    })
   }else{
       res.status(400).json('username password is incorrect')
   }

})
// const verify=(req,res,next)=>{
//     const authheader=req.headers.authorization;
//     if(authheader){
//         const token=authheader.split(" ")[1];
//         jwt.verify(token,"mysecretkey",(err,user)=>{
//             if(err){
//                 return res.status(403).json("token is not valid")
//             }

//             req.user=user;
//             next();
//         })
//     }else{
//         res.status(401).json("you are not authticates")
//     }
// }
const verify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
  
      jwt.verify(token, "secretkey", (err, user) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        }
  
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You are not authenticated!");
    }
  };

app.delete('/api/users/:id',verify,(req,res)=>{
    if(req.user.id===req.params.id|| req.user.isAdmin){
        res.status(200).json("user has been deleted")
    }else{
        res.status(403).json("you are not allowed to delted= the user")
    }

})

app.listen(5000,()=>{
    console.log("the eport is listening")
})