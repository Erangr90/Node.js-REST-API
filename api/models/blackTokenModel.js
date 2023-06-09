import mongoose from 'mongoose';

const blackTokenSchema = new mongoose.Schema(
  {
    tokenId: {
      type: String,
      required: true,
      unique: true,
    },
    expiration: {
      type: Date,
      expires: 0,
    },
  },
  { timestamps: true } 
);


blackTokenSchema.index({ expiration: 1 });
const BlackToken = mongoose.model('BlackToken', blackTokenSchema);

export default BlackToken;