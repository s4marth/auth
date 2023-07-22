const express =require('express');
const mysql=require('mysql');
const cors = require("cors");
const bcrypt = require('bcrypt');
const bodyParser=require("body-parser");
const cookieparser=require("cookie-parser")
const session=require("express-session");
const saltRounds = 10;
const AWS = require('aws-sdk');

const PORT=process.env.PORT || 8000;

const app=express();



app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}));
app.use(express.json());
app.use(cookieparser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    key:"userId",
    secret:"atanu",
    resave:false,
    saveUninitialized:false,
}))

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'signup'
})





app.get("/",(req,res)=>{
    res.send("hi");
})

app.post("/register",(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const name=req.body.name;
    const number = req.body.number;
    bcrypt.hash(password,saltRounds,(errr,hash)=>{
        const data={
            email:req.body.email,
            password:hash,      
            name: req.body.name,
            number: req.body.number,  
       
       };
       if(errr)
       {
        console.log(errr);
       }
       else{
        let sqll=`select * from users where email='${email}'`;
        db.query(sqll,(er,ress)=>{
            if(ress.length > 0)
            {
                res.send({msg:"User Email Already Present"})

            }
            else{
                let sql="INSERT INTO `users` SET ?";
                db.query(sql,data,(err,result)=>{
                    if(err)
                    {
                        console.log(err)
                    }
                    else{
                        //  console.log(result);
                         res.send(result);
                        // res.send()
            
                    }
                })
            }
        })

       

       }
      

    })
   
    
     
})

app.post("/login",(req,res)=>{
    
   const email=req.body.email;
    const password=req.body.password;
    const number = req.body.number;

    console.log(number);
        
      
        let sql=`select * from users where email='${email}' and number='${number}'`;
        console.log(sql);
        // console.log(sql);
        db.query(sql,(err,result)=>{
            if(err)
            {
                // res.send({err:err})
                console.log(err);
            }
            else{
              
               if(result.length > 0)
               {
                bcrypt.compare(password,result[0].password,(errr,response)=>{
                    if(response)
                    {
                        req.session.user=result;
                        // console.log(req.session.user);
                     
                     res.send({login:true,useremail:email});
                    }
                    else{
                     res.send({login:false,msg:"Wrong Password"});
                    
                    }
                })

                

               }
               else{
                    res.send({login:false,msg:"User Account Not Exits"});
                // console.log("noo email ")
               }
                
    
            }
        })

      
    
     
})
app.get("/login",(req,res)=>{
    if(req.session.user)
    {
        res.send({login:true,user:req.session.user});
    }
    else{
        res.send({login:false});
    }
})

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log("Logout Error:", err);
        res.status(500).send("Logout Error");
      } else {
        res.clearCookie("userId");
        res.send("Logout successful");
      }
    });
  });


app.listen(PORT,()=>{
    console.log(`app running in ${PORT}` )
})