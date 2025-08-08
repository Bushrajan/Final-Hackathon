import mongoose from "mongoose"; 

const hijabStyleSchema = new mongoose.Schema({
    name: String,
    description: String,
    imageUrl: String,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});


export default mongoose.model('hijab_Style', hijabStyleSchema);