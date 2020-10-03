const SteamAPI = require('steamapi');
const Discord = require('discord.js');
const bot = new Discord.Client();
const steamprice = require('steam-price-api');
const fs = require('fs')
var userId;
const token = 'Njk5NjEwOTM1MjE5NzE2MTQ2.XpW5dQ.kuSdSCqjX7xYlu-Fso8g20c9xTk';
const steam = new SteamAPI('1B3B15640528B8E2C8D411A4B3FE2345');
const request = require('postman-request');
const axios = require('axios')

const steaminventory = require('get-steam-inventory');

const PREFIX = '!';

bot.login(token);
bot.on('ready',()=>{
    console.log('Bot is online');
})

const getCompliment=async()=>{
    let {compliment} = await axios.get('https://complimentr.com/api');
    return compliment;
}

bot.on('message',msg=>{
    let args = msg.content.split(" ");
    console.log(args);
    switch(args[0]){
        case '!bans':
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

        case '!compliment':
            msg.reply(getCompliment());
        break;

        case '!hello':
            msg.reply('Hi');
        break;


        case '!level':
            steam.resolve(args[1]).then(id => {
                userId = id;
                steam.getUserLevel(userId).then(userlevel=>{
                    msg.reply('Steam Level is : '+userlevel);
                });
            });
        break;

        case '!inv':
            steam.resolve(args[1]).then(id => {
            userId = id;
            steaminventory.getinventory(730, userId, '2').then(data => {
                var items = "";
                console.log(data);
                data.marketnames.forEach(element => {
                    items = items + element + "\n";
                });
                msg.reply(items);
                console.log(items);
            }).catch(err => console.log(err));
            });
        break;

        case '!help':
                msg.reply('\n!inv (YOUR_STEAM_ID_URL) - Gives List of Items in Steam ID\n !bans (YOUR_STEAM_ID_URL) - Gives VAC Bans and Information about last VAC Ban\n !level (YOUR_STEAM_ID_URL) - Tells level of your Steam Account'+'\n!stats (YOUR_STEAM_ID_URL) - Gives Stats for a particular user' );
            break;

        case '!stats':
            steam.resolve(args[1]).then(id => {
                userId = id;
                steam.getUserStats(userId,730).then(res=>{
                    msg.reply('\nTotal kills : '+res.stats.total_kills+'\nTotal Deaths : '+res.stats.total_deaths+'\nTotal Time Played : '+res.stats.total_time_played+'\nTotal Bombs Planted : '+res.stats.total_planted_bombs+'\nTotal MVP : '+res.stats.total_mvps+'\nTotal Knife Kills : '+res.stats.total_kills_knife);
                })
            });

            case 'help':
                msg.reply('!inv (YOUR_STEAM_ID_URL) - Gives List of Items in Steam ID\n !bans (YOUR_STEAM_ID_URL) - Gives VAC Bans and Information about last VAC Ban\n !level (YOUR_STEAM_ID_URL) - Tells level of your Steam Account');
            break;

        case '!games':
            steam.resolve(args[1]).then(id => {
                userId = id;
                var games = "";
                steam.getUserOwnedGames(userId).then(res=>{
                    res.forEach(ele=>{
                        games = games + ele.name + ' : '+ (Math.round(parseInt(ele.playTime)/60)).toString() + ' hours\n';
                    });
                    msg.reply(games);
                });
            });
        case 'insult':
            let user = msg.mentions.users.first()
            let $ = this
            let insult = fs.readFile('./insults.txt','utf-8')
            insult = insults[Math.floor(Math.random() * insults.length)]
            msg.channel.send(`Hey ${user.username}, ${insult}`)
        break;

            case 'help':
                msg.reply('!inv (YOUR_STEAM_ID_URL) - Gives List of Items in Steam ID\n !bans (YOUR_STEAM_ID_URL) - Gives VAC Bans and Information about last VAC Ban\n !level (YOUR_STEAM_ID_URL) - Tells level of your Steam Account');
            break;
        
        case '!try' :
            steam.resolve(args[1]).then(id => {
                userId = id;
                var cost="0.0";
                cost = parseFloat(cost);
                steaminventory.getinventory(730, userId, '2').then(data => {
                    var len = data.marketnames.length;
                    //console.log('length is '+len);
                    data.marketnames.forEach(element => {
                        var item = encodeURI(element);
                        request('http://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name='+item, function (error, response, body) { // Print the response status code if a response was received
                            len--;
                            //console.log('rediced'+len);
                            try{
                                var parsed = (JSON.parse(body).median_price);
                                parsed = parsed.substring(1);
                                parsed = parseFloat(parsed);
                                typeof(parsed);
                                console.log(parsed);
                                cost = cost + parseFloat(parsed);
                                //console.log("cost is "+ cost);
                                if(len==0){
                                    msg.reply(cost+'$');
                                }
                                //console.log(element);
                            }catch(e){
                                console.log(element);
                                if(len==0){
                                    msg.reply(cost+'$');
                                }
                                //console.log(item);
                            }; // Print the HTML for the Google homepage.
                            });
                    });
                    //msg.reply(cost);
                    console.log(cost);
                }).catch(err => console.log(err));
                });

            
    }
})