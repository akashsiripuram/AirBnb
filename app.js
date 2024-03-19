const express = require('express');
const app = express();
const mongoose=require('mongoose');
const port=8080;
const Listing=require("./models/listing.js");
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');


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
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
})

//New & Create Route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
  });

//show route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
})

//create route
app.post("/listings", async (req,res)=>{
    // let {title,description,image,price,location,country}=req.body;
    let listing=req.body.listing;
    const newListing=await new Listing(listing);
    newListing.save();
    res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
})

app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
})

app.delete("/listings/:id",async  (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
        res.redirect("/listings");

});



app.listen(port,()=>{
    console.log('Server is running on port '+port);
})