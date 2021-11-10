import mongoose from "mongoose";
const Schema = mongoose.Schema;

const discountSchema = new Schema(
    {
        discount_rate:{
            type: Number,
            default:0
        },
        name:{
            type: String,
            required: true
            
        },
        shorthand:{
            type: String,
            default: function() {
                if(this.name){
                    return this.shorthand = this.get('name').substring(0,2) 
                }
                return null
            }
        }
    }
)

// bookingSchema.pre('validate', function(next){
//     if(this.name && !this.shorthand){
//         this.shorthand = this.get('name').substring(0,2) 
//     }
//     next();
// } )

const Discount = mongoose.model("discount", bookingSchema);

export { Discount };