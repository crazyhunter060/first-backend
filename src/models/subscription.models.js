import mongoose, { Schema } from "mongoose"

const subscriptionSchema=new mongoose.Schema(
    {
        subscriber: {
            typr: Schema.Types.ObjectId, // one who is subscribing
            ref: "User"
        }
    },{timestamps: true}
)

export const Subscription=mongoose.model("Subscription","subscriptionSchema")