import mongoose from 'mongoose';
import colors from 'colors';

import users from './data/users.js';
import User from './models/userModel.js';
import BlackToken from './models/blackTokenModel.js';

import connectDB from './config/db.js';


connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await BlackToken.deleteMany();

    await User.insertMany(users);



    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await BlackToken.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
