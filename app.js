const express = require('express');
const app = express();
const mongoose=require('mongoose');
const port=8080;
const Listing=require("./models/listing.js");
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync.js');
const ExpressError=require('./utils/ExpressError.js');


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("Connnected to DB");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("I am root");
})

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India"
//     })

//     await sampleListing.save();
//     console.log("Sample wass saved");
//     res.send("Successsful listing");
// })

//index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}))

//New & Create Route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
  });

//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
}))

//create route
app.post("/listings", wrapAsync(async (req,res,next)=>{
    // let {title,description,image,price,location,country}=req.body;
    
        
        if(!req.body.listing){
            throw new ExpressError(400,"Please fill Valid data");
        }
        const newListing=await new Listing(req.body.listing);
        newListing.save();
        res.redirect("/listings");
    
    })
);

//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}))

//update route
app.put("/listings/:id",wrapAsync(async (req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Please fill Valid data");
    }
    let {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}))

app.delete("/listings/:id",wrapAsync(async  (req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
        res.redirect("/listings");

}));


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err, req, res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    
    // res.render("error.ejs");
    res.status(statusCode).send(message);
})


app.listen(port,()=>{
    console.log('Server is running on port '+port);
})