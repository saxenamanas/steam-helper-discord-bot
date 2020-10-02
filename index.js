const SteamAPI = require('steamapi');
const steam = new SteamAPI('');
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs')
const token = '';
var userId;

const steaminventory = require('get-steam-inventory');

const PREFIX = '!';

bot.login(token);
bot.on('ready',()=>{
    console.log('Bot is online');
})

bot.on('message',msg=>{
    let args = msg.content.substring(PREFIX.length).split(" ");
    switch(args[0]){
        case 'bans':
            steam.resolve(args[1]).then(id => {
            userId = id;
            steam.getUserBans(userId).then(banList=>{
                msg.reply('VAC Bans :'+banList.vacBans);
                if(banList.vacBans!=0){
                    msg.reply(banList.daysSinceLastBan+' days since last ban.');
                }
            });
        });
        break;

        case 'level':
            steam.resolve(args[1]).then(id => {
                userId = id;
                steam.getUserLevel(userId).then(userlevel=>{
                    msg.reply('Steam Level is : '+userlevel);
                });
            });
        break;

        case 'inv':
            steam.resolve(args[1]).then(id => {
            userId = id;
            steaminventory.getinventory(730, userId, '2').then(data => {
                var items = "";
                data.marketnames.forEach(element => {
                    items = items + element + "\n";
                });
                msg.reply(items);
                console.log(data.raw);
            }).catch(err => console.log(err));
            });
        break;

        case 'insult':
            let user = msg.mentions.users.first()
            let insults = ""
            let insult = ""
            let $ = this
            fs.readFile('./insults.txt', (err, data) => {
                $.insults = data.split('\n')
            })
            insult = insults[Math.floor(Math.random() * insults.length)]
            msg.channel.send(`Hey ${user.username}, ${insult}`)
        break;

            case 'help':
                msg.reply('!inv (YOUR_STEAM_ID_URL) - Gives List of Items in Steam ID\n !bans (YOUR_STEAM_ID_URL) - Gives VAC Bans and Information about last VAC Ban\n !level (YOUR_STEAM_ID_URL) - Tells level of your Steam Account');
            break;
    }
})