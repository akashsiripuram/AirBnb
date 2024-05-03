const express=require("express");
const app=express();
const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const path=require('path');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions={
    secret:"mysecretstring",
    resave:false,
    saveUninitialized:true,
};


app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) =>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let {name="anonymus"}=req.query;
    req.session.name=name;
    if(name==="anonymus"){
        req.flash("error","User registration failed");
    }
    else{
        req.flash("success","User registered successfully");
    }
    
    
    res.redirect("/test");
})

app.get("/test",(req,res)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    res.render("page.ejs", {name:req.session.name});
})

app.listen(3000,()=>{
    console.log("Listening on port 3000");
})