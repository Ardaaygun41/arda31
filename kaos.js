const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
var Jimp = require('jimp');
const { Client, Util } = require('discord.js');
const weather = require('weather-js')
const fs = require('fs');
const { readdirSync } = require("fs");
const { join } = require("path");
const db = require("quick.db")
const http = require('http');
const express = require('express');
require('./util/eventLoader')(client);
const path = require('path');
const request = require('request');
const snekfetch = require('snekfetch');
const queue = new Map();
const { GiveawaysManager } = require('discord-giveaways');

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping tamamdır.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});

client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});
//küfür engel // küfür engel // küfür engel // küfür engel //
client.on('message', async message => {
  let ke = await db.fetch(`kufur_${message.guild.id}`)
  
  if (ke === "kapali" || ke === undefined || ke === null){
    return;
  } else if (ke === "acik") {
    let küfür = ["oç", "ananı", "sikeyim", "orospu", "cocugu", "ibne", "götünü", "sikik", "yarrak", "amcık", "amk", "aq", "amq", "mk", "sg", "siktir", "siktir git", ""]
    if (küfür.some(word => message.content.includes(word))){
        if (!message.member.hasPermission("BAN_MEMBERS")) {
        message.delete();
        message.channel.send("Küfür etmek yasak kardeşim!")
        message.guild.owner.send("Sunucunuzda bir kişi küfür etti. \nKullanıcı: "+ message.author.tag +" \nMesaj: **"+ message +"** ")
      }
    }
    
  }
})
//küfür engel // küfür engel // küfür engel // küfür engel //

client.on('message', async message =>{
if (message.channel.id === "812074449427628032") {
message.react("<a:kaos_onay1:773574751552929813>") 
message.react("<a:kaos_red:814846278621069372>")
}
})

//mute//
client.on('roleDelete', async role => {
    const data = await require('quick.db').fetch(`codework-mute.${role.guild.id}`);
    if(data && data === role.id) require('quick.db').delete(`codework-mute.${role.guild.id}`); 
    });
//

client.on('message', async message => {
let aktif = await db.fetch(`reklamEngelcodeshare_${message.channel.id}`)
if (!aktif) return 
let reklamlar = ["discord.app", "discord.gg" ,"discordapp","discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az", ".cf", ".me", ".in"]
let kelimeler = message.content.slice(" ").split(/ +/g)
if (reklamlar.some(word => message.content.toLowerCase().includes(word))) {
if (message.member.hasPermission("BAN_MEMBERS")) return;
message.delete({timeout: SÜRE})()
message.reply('Reklamları engelliyorum!').then(msg => msg.delete(7000)) 
}
});

//reklam engel // reklam engel // reklam engel // reklam engel //


client.on("messageUpdate", async (oldMsg, newMsg) => {
let aktif = await db.fetch(`reklamEngelcodeshare_${oldMsg.channel.id}`)
if(!aktif) return
let reklamlar = ["discord.app", "discord.gg","discordapp","discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az", ".cf", ".me", ".in"]
let kelimeler = newMsg.content.slice(" ").split(/ +/g)
if (reklamlar.some(word => newMsg.content.toLowerCase().includes(word))) {
if (newMsg.member.hasPermission("BAN_MEMBERS")) return;
newMsg.delete()
oldMsg.reply('Reklamları engelliyorum!').then(msg => msg.delete(7000)) 
}
});

//otorol // otorol // otorol // otorol // otorol //
client.on("guildMemberAdd", async member => {
  
 let kanal = db.fetch(`judgekanal_${member.guild.id}`)   
 let rol = db.fetch(`judgerol_${member.guild.id}`)
 let mesaj = db.fetch(`judgemesaj_${member.guild.id}`)
  
if(!kanal) return
member.roles.add(rol)
  client.channels.cache.get(kanal).send('> <a:kaos_kalpp:806841473541996574> **<@' + member.user.id+  '>** **Adlı Kullanıcı Aramıza Katıldı** \n** > Kullanıcısına Başarıyla** <@&' + rol + '> **Rolü verildi**')
});
//otorol // otorol // otorol // otorol // otorol //





//sayaç // sayaç// sayaç // sayaç // sayaç // sayaç //
client.on("guildMemberAdd", async member => {
  let sayac = await db.fetch(`sayac_${member.guild.id}`);
  let skanal = await db.fetch(`sayacK_${member.guild.id}`);
  if (!sayac) return;
  if (member.guild.memberCount >= sayac) {
    member.guild.channels.cache
      .get(skanal)
      .send(
        ` **${
          member.user.tag
        }** sunucuya **katıldı**! \`${db.fetch(
          `sayac_${member.guild.id}`
        )}\` kişi olduk! Sayaç sıfırlandı.`
);
   db.delete(`sayac_${member.guild.id}`);
    db.delete(`sayacK_${member.guild.id}`);
    return;
  } else {
    member.guild.channels.cache
      .get(skanal)
      .send(
        ` **${
          member.user.tag
        }** sunucuya **katıldı**! \`${db.fetch(
          `sayac_${member.guild.id}`
        )}\` üye olmamıza son \`${db.fetch(`sayac_${member.guild.id}`) -
          member.guild.memberCount}\` üye kaldı! Sunucumuz şuanda \`${
          member.guild.memberCount
        }\` kişi!`
);
}
});


client.on("guildMemberRemove", async member => {
  let sayac = await db.fetch(`sayac_${member.guild.id}`);
  let skanal = await db.fetch(`sayacK_${member.guild.id}`);
  if (!sayac) return;
  member.guild.channels.cache
    .get(skanal)
    .send(
      ` **${
        member.user.tag
      }** sunucudan **ayrıldı**! \`${db.fetch(
        `sayac_${member.guild.id}`
      )}\` üye olmamıza son \`${db.fetch(`sayac_${member.guild.id}`) -
        member.guild.memberCount}\` üye kaldı! Sunucumuz şuanda \`${
        member.guild.memberCount
      }\` kişi!`
);
});
//sayaç // sayaç// sayaç // sayaç // sayaç // sayaç //


//sa-as // sa-as // sa-as //
client.on('message', async (msg, member, guild) => {
  let i = await  db.fetch(`saas_${msg.guild.id}`)
      if(i === 'açık') {
        if (msg.content.toLowerCase() === 'sa') {
        msg.reply('Aleyküm Selam Hoşgeldin');      
      } 
      }
    });
//sa-as// //sa-as// //sa-as// //sa-as//


//////çekiliş/////////
if(!db.get("giveaways")) db.set("giveaways", []);

const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {

    async getAllGiveaways(){
        return db.get("giveaways");
    }

    async saveGiveaway(messageID, giveawayData){
        db.push("giveaways", giveawayData);
        return true;
    }

    async editGiveaway(messageID, giveawayData){
        const giveaways = db.get("giveaways");
        const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID);
        newGiveawaysArray.push(giveawayData);
        db.set("giveaways", newGiveawaysArray);
        return true;
    }

    async deleteGiveaway(messageID){
        const newGiveawaysArray = db.get("giveaways").filter((giveaway) => giveaway.messageID !== messageID);
        db.set("giveaways", newGiveawaysArray);
        return true;
    }
  
  
};
const manager = new GiveawayManagerWithOwnDatabase(client, {
  storage: false,
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    embedColor: "#0a99ff",
    reaction: "🎉"
  }
});
client.giveawaysManager = manager;
///Çekiliş///

//seviye//
client.on("message", async message => {
  let prefix = ayarlar.token;

  var id = message.author.id;
  var gid = message.guild.id;

  let hm = await db.fetch(`seviyeacik_${gid}`);
  let kanal = await db.fetch(`svlog_${gid}`);
  let xps = await db.fetch(`verilecekxp_${gid}`);
  let seviyerol = await db.fetch(`svrol_${gid}`);
  let rollvl = await db.fetch(`rollevel_${gid}`);

  if (!hm) return;
  if (message.content.startsWith(prefix)) return;
  if (message.author.bot) return;

  var xp = await db.fetch(`xp_${id}_${gid}`);
  var lvl = await db.fetch(`lvl_${id}_${gid}`);
  var xpToLvl = await db.fetch(`xpToLvl_${id}_${gid}`);

  if (!lvl) {
    
    if (xps) {
      db.set(`xp_${id}_${gid}`, xps);
    }
    db.set(`xp_${id}_${gid}`, 4);
    db.set(`lvl_${id}_${gid}`, 1);
    db.set(`xpToLvl_${id}_${gid}`, 100);
  } else {
    if (xps) {
      db.add(`xp_${id}_${gid}`, xps);
    }
    db.add(`xp_${id}_${gid}`, 4);

    if (xp > xpToLvl) {
      db.add(`lvl_${id}_${gid}`, 1);
      db.add(
        `xpToLvl_${id}_${gid}`,
        (await db.fetch(`lvl_${id}_${gid}`)) * 100
      );
      if (kanal) {
        client.channels
          .cache.get(kanal.id)
          .send(
            message.member.user.username +
              " **Seviye Atladı!** Yeni seviyesi; " +
              lvl +
              " **Tebrikler!** <a:sari_hediye:805907430387089440> "
          );

        
      }
   
    }

    if (seviyerol) {
      if (lvl >= rollvl) {
        message.guild.member(message.author.id).addRole(seviyerol);
        if (kanal) {
          client.channels
            .get(kanal.id)
            .send(
              message.member.user.username +
                " Yeni Seviyesi " +
                rollvl +
                "  seviyeye ulaştı ve " +
                seviyerol +
                " Rolünü kazandı! <a:sari_hediye:805907430387089440> "
            );
        }
      }
    }
  }

  
});
//seviye//
//mod-log//
client.on('channelCreate', async channel => {
  const c = channel.guild.channels.cache.get(db.fetch(`codeminglog_${channel.guild.id}`));
  if (!c) return;
    var embed = new Discord.MessageEmbed()
                    .addField(`Kanal oluşturuldu`, ` İsmi: \`${channel.name}\`\n Türü: **${channel.type}**\n► ID: ${channel.id}`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${channel.client.user.username}#${channel.client.user.discriminator}`, channel.client.user.avatarURL)
    c.send(embed)
});

client.on('channelDelete', async channel => {
  const c = channel.guild.channels.cache.get(db.fetch(`codeminglog_${channel.guild.id}`));
  if (!c) return;
    let embed = new Discord.MessageEmbed()
                    .addField(`Kanal silindi`, ` İsmi: \`${channel.name}\`\n Türü: **${channel.type}**\n��� ID: ${channel.id}`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${channel.client.user.username}#${channel.client.user.discriminator}`, channel.client.user.avatarURL)

    c.send(embed)
});

   client.on('channelNameUpdate', async channel => {
  const c = channel.guild.channels.cache.get(db.fetch(`codeminglog_${channel.guild.id}`));
  if (!c) return;
    var embed = new Discord.MessageEmbed()
                    .addField(`Kanal İsmi değiştirildi`, ` Yeni İsmi: \`${channel.name}\`\n► ID: ${channel.id}`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${channel.client.user.username}#${channel.client.user.discriminator}`, channel.client.user.avatarURL)
    c.send(embed)
});

client.on('emojiCreate', emoji => {
  const c = emoji.guild.channels.cache.get(db.fetch(`codeminglog_${emoji.guild.id}`));
  if (!c) return;

    let embed = new Discord.MessageEmbed()
                    .addField(`Emoji oluşturuldu`, ` İsmi: \`${emoji.name}\`\n GIF?: **${emoji.animated}**\n► ID: ${emoji.id}`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${emoji.client.user.username}#${emoji.client.user.discriminator}`, emoji.client.user.avatarURL)

    c.send(embed)
    });
client.on('emojiDelete', emoji => {
  const c = emoji.guild.channels.cache.get(db.fetch(`codeminglog_${emoji.guild.id}`));
  if (!c) return;

    let embed = new Discord.MessageEmbed()
                    .addField(`Emoji silindi`, ` İsmi: \`${emoji.name}\`\n GIF? : **${emoji.animated}**\n► ID: ${emoji.id}`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${emoji.client.user.username}#${emoji.client.user.discriminator}`, emoji.client.user.avatarURL)

    c.send(embed)
    });
client.on('emojiUpdate', (oldEmoji, newEmoji) => {
  const c = newEmoji.guild.channels.cache.get(db.fetch(`codeminglog_${newEmoji.guild.id}`));
  if (!c) return;

    let embed = new Discord.MessageEmbed()
                    .addField(`Emoji güncellendi`, ` Eski ismi: \`${oldEmoji.name}\`\n Yeni ismi: \`${newEmoji.name}\`\n► ID: ${oldEmoji.id}`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${newEmoji.client.user.username}#${newEmoji.client.user.discriminator}`, newEmoji.client.user.avatarURL)

    c.send(embed)
    });

client.on('guildBanAdd', async (guild, user) => {    
    const channel = guild.channels.cache.get(db.fetch(`codeminglog_${guild.id}`));
  if (!channel) return;
  
  const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first())

    let embed = new Discord.MessageEmbed()
                    .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL)
                    .addField(`Kullanıcı banlandı`, ` İsmi: \`${user.username}\`\n ID: **${user.id}**\n Sebep: **${entry.reason || 'Belirtmedi'}**\n Banlayan: **${entry.executor.username}#${entry.executor.discriminator}**`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${entry.executor.username}#${entry.executor.discriminator} tarafından`, entry.executor.avatarURL)

    channel.send(embed)
});

client.on('guildBanRemove', async (guild, user) => {    
    const channel = guild.channels.cache.get(db.fetch(`codeminglog_${guild.id}`));
  if (!channel) return;
  
  const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first())

    let embed = new Discord.MessageEmbed()
                    .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL)
                    .addField(`Kullanıcının banı açıldı`, ` İsmi: \`${user.username}\`\n ID: **${user.id}**\n Banı Kaldıran: **${entry.executor.username}#${entry.executor.discriminator}**`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${entry.executor.username}#${entry.executor.discriminator} tarafından`, entry.executor.avatarURL)

    channel.send(embed)
});
client.on('messageDelete', async message => {    
  if(message.author.bot) return

    const channel = message.guild.channels.cache.get(db.fetch(`codeminglog_${message.guild.id}`));
  if (!channel) return;
  
    let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
                    .setTitle("Mesaj silindi")                
                    .addField(`Silinen mesaj : ${message.content}`,`Kanal: ${message.channel.name}`)
                    .addField(`Kanal:`,`${message.channel.name}`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${message.client.user.username}#${message.client.user.discriminator}`, message.client.user.avatarURL)

    channel.send(embed)
});

client.on('messageUpdate', async(oldMessage, newMessage) => {
    if(oldMessage.author.bot) return;
    if(oldMessage.content == newMessage.content) return;

    const channel = oldMessage.guild.channels.cache.get(db.fetch(`codeminglog_${oldMessage.guild.id}`));
    if(!channel) return;

    let embed = new Discord.MessageEmbed()
    .setTitle("Mesaj güncellendi!")
    .addField("Eski mesaj : ",`${oldMessage.content}`)
    .addField("Yeni mesaj : ",`${newMessage.content}`)
    .addField("Kanal : ",`${oldMessage.channel.name}`)
    .setTimestamp()
    .setColor("RANDOM")
    .setFooter(`${oldMessage.client.user.username}#${oldMessage.client.user.discriminator}`,`${oldMessage.client.user.avatarURL}`)

    channel.send(embed)
});

client.on('roleCreate', async (role) => {    

    const channel = role.guild.channels.cache.get(db.fetch(`codeminglog_${role.guild.id}`));
  if (!channel) return;
  
    let embed = new Discord.MessageEmbed()
.addField(`Rol oluşturuldu`, ` ismi: \`${role.name}\`\n ID: ${role.id}`)                    
.setTimestamp()
.setColor("RANDOM")
.addField("Rol renk kodu : ",`${role.hexColor}`)
.setFooter(`${role.client.user.username}#${role.client.user.discriminator}`, role.client.user.avatarURL)

    channel.send(embed)
});

client.on('roleDelete', async (role) => {    

 const channel = role.guild.channels.cache.get(db.fetch(`codeminglog_${role.guild.id}`));
  if (!channel) return;
  
    let embed = new Discord.MessageEmbed()
.addField(`Rol silindi`, ` ismi: \`${role.name}\`\n ID: ${role.id}`)                    
.setTimestamp()
.setColor("RANDOM")
    .addField("Rol renk kodu : ",`${role.hexColor}`)
.setFooter(`${role.client.user.username}#${role.client.user.discriminator}`, role.client.user.avatarURL)

    channel.send(embed)
})
//mod log//
//afk//
client.on("message", async message => {
  const ms = require("parse-ms");
  if (message.author.bot) return;
  if (!message.guild) return;
  if (message.content.includes(`${prefix}afk`)) return;

  if (await db.fetch(`afk_${message.author.id}`)) {
    let cfxtime = await db.fetch(`afk_süre_${message.author.id}`);
    let cfxs = ms(Date.now() - cfxtime);
    db.delete(`afk_${message.author.id}`);
    db.delete(`afk_süre_${message.author.id}`);
    const codefenixkodpaylasim = new Discord.MessageEmbed()
      .addField(
        `${message.author.username}**afk modundan çıktın.**`,
        `**\`${cfxs.hours}\` **saat**  \`${cfxs.minutes}\` **dakika** \`${cfxs.seconds}\` **saniye** ,  AFK Modundaydın!**`)
      .setColor("RANDOM")
      .setFooter(`${client.user.username}`, client.user.avatarURL());
     message.member.setNickname(`${message.author.username}`)
    message.channel.send(codefenixkodpaylasim);

  }

  var cfxu = message.mentions.users.first();
  if (!cfxu) return;
  var REASON = await db.fetch(`afk_${cfxu.id}`);

  if (REASON) {
    let cfxtime = await db.fetch(`afk_süre_${cfxu.id}`);
    let cfxs = ms(Date.now() - cfxtime);
    const codefenixkodpaylasim2 = new Discord.MessageEmbed()
      .addField(
        `**${cfxu.username}** adlı kullanıcı \`${REASON}\` sebebiyle;`,
        ` **${cfxs.hours}** saat  **${cfxs.minutes}** dakika **${cfxs.seconds}** saniyeden beri afk modunda.`
      )
      .setColor("RANDOM")
      .setFooter(`${client.user.username}`, client.user.avatarURL());
    message.reply(codefenixkodpaylasim2);
  }
});

//afk//
//bot-eklenince-dm//
client.on("guildCreate", guild => {
guild.owner.send(`
**Merhaba, __${guild.owner.user.username}__**\n
**Beni __Kurucusu__ olduğun __${guild.name}__ sunucusuna eklediğin için teşekkürler**

**Botumuzdaki özelliklere daha hızlı ulaşabilmek için https://discord.gg/8Nuzaw9x4B sunucumuza gelebilirsin.**
`)
})
//bot-eklenince-dm//
//Prefix//
client.on("message", async message => {

  if (message.author.bot) return;

  if (!message.guild) return;

  let prefix = db.get(`prefix_${message.guild.id}`);

  if (prefix === null) prefix = prefix;

  if (!message.content.startsWith(prefix)) return;

  if (!message.member)

  message.member = await message.guild.fetchMember(message);

  const args = message.content

    .slice(prefix.length)

    .trim()

    .split(/ +/g);

  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;
  
  let command = client.commands.get(cmd);

  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, message, args);

});
//prefix//
//etiket-prefix//
client.on("message", msg => {
    //let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!";
    const rache = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setDescription(`**Merhaba! Prefix'im \`k!\` Yardım için \`k!yardım\` Yazabilirsiniz.**`)
  if (msg.content.includes(`<@${client.user.id}>`) || msg.content.includes(`<@!${client.user.id}>`)) {
    msg.channel.send(rache);
  }
});
//etiket-prefix//
//rol-koruma//
client.on("roleDelete", async role => {
  let rolko = await db.fetch(`rolk_${role.guild.id}`);
  if (rolko) { 
         const entry = await role.guild.fetchAuditLogs({ type: "ROLE_DELETE" }).then(audit => audit.entries.first());
    if (entry.executor.id == client.user.id) return;
  role.guild.roles.create({ data: {
          name: role.name,
          color: role.color,
          hoist: role.hoist,
          permissions: role.permissions,
          mentionable: role.mentionable,
          position: role.position
}, reason: 'Silinen Roller Tekrar Açıldı.'})
  }
})

//

client.on("roleCreate", async role => {
  let rolk = await db.fetch(`rolk_${role.guild.id}`);
  if (rolk) { 
       const entry = await role.guild.fetchAuditLogs({ type: "ROLE_CREATE" }).then(audit => audit.entries.first());
    if (entry.executor.id == client.user.id) return;
  role.delete()
}
})
//rol-koruma//
//kanal-koruma//
client.on("channelDelete", async function(channel) {
    let rol = await db.fetch(`kanalk_${channel.guild.id}`);
  
  if (rol) {
const guild = channel.guild.cache;
let channelp = channel.parentID;

  channel.clone().then(z => {
    let kanal = z.guild.channels.find(c => c.name === z.name);
    kanal.setParent(
      kanal.guild.channels.find(channel => channel.id === channelp)
      
    );
  });
  }
})
//kanal-koruma//
//emoji-koruma//
client.on("emojiDelete", async (emoji, message, channels) => {
  let emojik = await db.fetch(`emojik_${emoji.guild.id}`)
  if (emojik) {
  const entry = await emoji.guild.fetchAuditLogs({ type: "EMOJI_DELETE" }).then(audit => audit.entries.first());
  if (entry.executor.id == client.user.id) return;
  if (entry.executor.id == emoji.guild.owner.id) return;
  if (!emoji.guild.members.cache.get(entry.executor.id).hasPermission('ADMINISTRATOR')) {
    
  emoji.guild.emojis.create(`${emoji.url}`, `${emoji.name}`).catch(console.error);

  
  }
  }
});
//emoji-koruma/



client.login(ayarlar.token);
