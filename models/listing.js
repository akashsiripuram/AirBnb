const mongoose=require('mongoose');
const Review=require('./review');
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,

    },
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1682685797366-715d29e33f9d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=> v===""?"https://images.unsplash.com/photo-1682685797366-715d29e33f9d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing)
    await Review.deleteMany({_id:{$in:listing.reviews}})
})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;