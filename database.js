import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Učitaj environment varijable
dotenv.config();

// Connection string
const uri = `${process.env.MONGO_CONNECTION_STRING}`;

// Podešavanje moongoose-a
const options =  {
    useNewUrlParser:true, 
    useUnifiedTopology:true, 
    serverSelectionTimeoutMS: 5000,
    heartbeatFrequencyMS: 1000,
    keepAlive:true, 
    keepAliveInitialDelay:3000
};

// Struktura user dokumenta
const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String
});

// Struktura Token dokumenta
const TokenSchema = new mongoose.Schema({
    apiName: String,
    token: String,
    timestamp: String
});


// Definiranje User modela i automatsko stvaranje kolekcije Users
const User = mongoose.model('User', UserSchema);

// Definiranje Token modela i automatsko stvaranje kolekcije tokens
const Token = mongoose.model('Token', TokenSchema);

// Uspostavi konekciju s bazom podataka
mongoose.connect(uri, options)
    .then(() =>{
        console.log('\nConnection with Atlas cloud established');
    })
    .catch(err => {
        console.log(`\nAn error has occured while trying to connect to Atlas cluster.\n${err}`);
    });

// Cluster disconnect listener
mongoose.connection.on('disconnected', (err => {
    console.log(`\nDisconnected from Atlas cluster.\n${err}`);
}))

// Eksportiraj model
export {User, Token};
