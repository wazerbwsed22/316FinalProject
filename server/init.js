const Questions = require("./models/questions");
const Answers = require("./models/answers");
const Comment = require("./models/comment");
const User = require("./models/users");

const { default: mongoose } = require("mongoose");
const mongoUrl = 'mongodb://localhost:27017/fake_so'

const bcrypt = require("bcrypt");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const admin_email = process.argv[2];
const admin_password = process.argv[3];
const admin_username = process.argv[4];

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection; 
const passwordHashed = bcrypt.hashSync(admin_password, salt);


database.on('error', console.error.bind(console, 'Theres a connection error:'));
database.once('open', async () => {
    console.log("Connected to database");
    try {
        const admin = new User({ username: admin_username,
            email: admin_email,
            passwordHash: passwordHashed,
            admin: true,
        });
        await admin.save();
        console.log("New admin user created");
    } catch (error) {
        console.log(error);
    }
    database.close();
});