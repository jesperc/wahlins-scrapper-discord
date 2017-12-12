const Discord = require('discord.js');
const auth = require('./auth.json');
const axios = require('axios');

const URL = `http://wahlinfastigheter.se/lediga-objekt/lagenhet/`;
const READY = 'I will now look for newly added apartments on Wåhlins Fastigheter. Beep Boop.';
const SEARCH = 'Just nu har vi tyvärr inga lediga lägenheter att förmedla här';
const MATCH = 'There are avaliable apartments! Go to: http://wahlinfastigheter.se/lediga-objekt/lagenhet/';
const INTERVAL_IN_MS = 60000; // once per minute
const CHANNEL_ID = '385206524244525057';

const client = new Discord.Client();

// bot is ready
client.on('ready', (evt) => {
    console.log('Connected!');
    sendMessage(READY);
});

// send message to Discord channel
const sendMessage = (message) => {
    let channel = client.channels.find(c => c.id === CHANNEL_ID);
    channel.send(message);
};

// loop get request
const requestLoop = setInterval(() => {
    if (client.user !== undefined) {
        axios.get(URL).then((response) => {
            let html = response.data;
            if (html.indexOf(SEARCH) < 0) {
                sendMessage(MATCH);
            } 
            else {
                console.log("test!");
            }
        }).catch((error) => {
            console.log(error);
            sendMessage(error);
        });
    }
}, INTERVAL_IN_MS);

client.login(auth.token);