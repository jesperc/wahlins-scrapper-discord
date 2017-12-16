const Discord = require('discord.js');
const auth = require('./auth.json');
const axios = require('axios');

const URL = `http://wahlinfastigheter.se/lediga-objekt/lagenhet/`;
const READY = 'I will now look for newly added apartments on Wåhlins Fastigheter. Beep Boop.';
const SEARCH = 'Just nu har vi tyvärr inga lediga lägenheter att förmedla här';
const MATCH = 'There are avaliable apartments! Go to: http://wahlinfastigheter.se/lediga-objekt/lagenhet/';
const INTERVAL_IN_MS = 60000; // once per minute
const CHANNEL_ID = '385206081594327042';

const client = new Discord.Client();

let status = "Running";

// bot is ready
client.on('ready', (event) => {
    console.log('Connected!');
    sendMessage(READY);
});

client.on('error', (error) => {
    console.log(error);
    sendMessage("Client on error");
});

client.on('disconnect', (event) => {
    console.log(event);
    sendMessage("Client on disconnect");
});

client.on('message', (message) => {
    console.log(message.content);
    if (message.content === '!status') {
        sendMessage(`My status is: ${status}`);
        axios.get(URL).then((response) => {
            sendMessage('Get request: Successful');
        }).catch((error) => {
            sendMessage('Get request: Failure');
        });
    }
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
            status = "Running";
            let html = response.data;
            if (html.indexOf(SEARCH) < 0) {
                sendMessage(MATCH);
            } 
        }).catch((error) => {
            console.log(error);
            sendMessage("Error occured on axios get request!");
            sendMessage(error);
            status = "Error";
        });
    }
}, INTERVAL_IN_MS);

client.login(auth.token);