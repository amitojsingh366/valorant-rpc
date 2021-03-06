var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

const path = __importDefault(require("path"));
const express = __importDefault(require("express"));
const bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();


const app = express.default();

app.set('view engine', 'ejs');
app.set('views', path.default.join(__dirname, './views'))
app.use('/static', express.default.static(path.default.join(__dirname, './static')));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(upload.array());

app.get('/', (req, res, next) => {
    res.render('home', { home: "active" });
});



app.post('/update', async(req, res, next) => {
    var time = req.body.time;
    var timeunit = req.body.timeunit;
    if (time) {
        if (time > 1) {
            switch (timeunit) {
                case 'hour':
                    time = `for ${time} hours`
                    break;
                case 'min':
                    time = `for ${time} minutes`
                    break;
                case 'day':
                    time = `for ${time} days`
                    break;
                default:
                    time = `for 1 hour`
                    break;
            }
        } else {
            switch (timeunit) {
                case 'hour':
                    time = `for 1 hour`
                    break;
                case 'min':
                    time = `for 1 minute`
                    break;
                case 'day':
                    time = `for 1 day`
                    break;
                default:
                    time = `for 1 hour`
                    break;
            }
        }
        await RPC('start', time, false, '');
    } else {
        await RPC('start', 'for 1 hour', false, '');
    }
    res.redirect('/');
});

app.post('/disconnect', async(req, res, next) => {
    res.redirect('/');
    process.exit();
});


app.listen(6969, () => console.log("Server Running\nGo to http://localhost:6969 to get started"));


async function RPC(action, time, joinable, partyDetail) {
    const client = require('discord-rich-presence')('765686252933742593');

    client.on('join', (secret) => {
        console.log('we should join with', secret);
    });

    client.on('spectate', (secret) => {
        console.log('we should spectate with', secret);
    });

    client.on('joinRequest', (user) => {
        if (user.discriminator === '1337') {
            client.reply(user, 'YES');
        } else {
            client.reply(user, 'IGNORE');
        }
    });
   

    if (action == 'start') {
       

        client.on('connected', () => {
            console.log('connected!');
            client.updatePresence({
                //state: 'something', //<- party size shows here
                details: time,
                //startTimestamp: Date.now(),
                //endTimestamp: Date.now() + 99999999,
                largeImageKey: 'logo_new',
                largeImageText: "Playing VALORANT",
                //smallImageKey: 'online',
                //smallImageText: 'Online',
                instance: true,
                //partyId: 'priv_party',
                //partySize: 2,
                //partyMax: 2,
                //matchSecret: 'abXyyz',
                //joinSecret: 'moonSqik',
                //spectateSecret: 'kLopNq',
            });
        });

        process.on('unhandledRejection', console.error);
    } else if (action == 'update') {
        if (joinable) {
            var presence = {
                details: 'for 5 hours',
                largeImageKey: 'logo_new',
                largeImageText: "Playing VALORANT",
                instance: true,
                partyId: 'priv_party',
                matchSecret: 'abXyyz',
                joinSecret: 'moonSqik',
                spectateSecret: 'kLopNq',
            };

            client.updatePresence(presence);
        }

    }



}