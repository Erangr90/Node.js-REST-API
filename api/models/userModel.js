import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import redisClient from '../config/redis.js'


const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return v.length >= 2 && v.length <= 25;
        },
        message: props => `${props.value} exceeds the bounders of 2-25 characters`
      }
    },
    lastName: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return v.length >= 2 && v.length <= 25;
        },
        message: props => `${props.value} exceeds the bounders of 2-25 characters`
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator:  function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: props => `${props.value} email address invalid`
      }
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return v.length >= 8 && v.length <= 255;
        },
        message: props => `${props.value} exceeds the bounders of 8-255 characters`
      }
    },
    clicks:{
      date:{
        type:Date,
        default: new Date()
      },
      numOfClicks:{
        type:Number,
        default:0
      }
    },
    subscriptions:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    }],
    products:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
  isSubtribe:{type:Boolean, default:false},
  isAdmin:{type:Boolean, default:false},
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

const changeStream = User.watch();

changeStream.on('change', async (change) => {

  const { operationType, fullDocument, updateDescription, documentKey, ns } = change;

  switch (operationType) {
    case "insert":
      await redisClient.set(
        `${ns.coll}:${fullDocument._id}`,
        JSON.stringify(fullDocument),
      );
      break;
    case "update":

      const updatedFields = updateDescription.updatedFields;
      let redisCache = await redisClient.get(`${ns.coll}:${documentKey._id}`);
      redisCache = await JSON.parse(redisCache);
      for (const field in updatedFields) {
        if (field !== 'products') {
          redisCache[field] = updatedFields[field];
        }   
      }   
      await redisClient.set(`${ns.coll}:${documentKey._id}`, JSON.stringify(redisCache));

      if (updatedFields.products || updatedFields.subscriptions) {
        const user = await User.findById(documentKey._id).populate('products').populate('subscriptions');
        await redisClient.set(`${ns.coll}:${documentKey._id}`, JSON.stringify(user));
      }
      break;
    case "delete":
      await redisClient.del(`${ns.coll}:${documentKey._id}`);
      break;
    default:
      break;
  }
});

changeStream.on('error', (error) => {
  console.error('Change stream error:', error);
});

export default User;
