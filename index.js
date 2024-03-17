const express = require("express"); 
const app = express();

app.listen(3000, () => {
  console.log("project is running!");
})

app.get("/", (req, res) => {
  res.send("Hello world!");
})

const Discord = require("discord.js");
const bot = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
const PREFIX = "!";

//Ready
bot.on("ready", () => {
  console.log(`Logged in as ${bot.user.tag}`)
})

const fs = require('fs');

//Maps
bot.on('messageCreate', message => {
  if (message.content === `${PREFIX}map`) {
    message.channel.send('https://cdn.discordapp.com/attachments/525446409533521931/1086307744488894554/Eden_v1_VTT.jpg');
  }
});



//Docs
bot.on('messageCreate', message => {
  if (message.content === `${PREFIX}docs`) {
    message.channel.send('Party Stuff: https://drive.google.com/drive/folders/1Y9JQLM0p7MCdJ17l_-b5cqEv54M-MwTU\nEnchanting: https://docs.google.com/document/d/1uK56a1yG0lmJVxMzD0hFy-QxsqV8rv1_32EneiWqxik/edit\nStat Updates: https://docs.google.com/document/d/1sw_bOcyE-JxZXwHsxGrhfh4jLs8BSMnuyczqavAi4ak/edit');
  }
});

/*------------------------------------------------Rolls---------------------------------------------*/
bot.on('messageCreate', message => {
  if (!message.content.startsWith(PREFIX)) return;
  const command = message.content.substring(PREFIX.length);
  if (!/^(d|\d)/i.test(command)) return;
  const items = command.split(/(?=[+-])/);

  let total = 0;
  let rolls = [];
  let equationNums = [];
  let operators = [];
  let runningTotal = 0;

  for (let i = 0; i < items.length; i++) {
    if (items[i].includes("+")) {
      operators.push("+");
      items[i].replace('+', '')
    }
    if (items[i].includes("-")) {
      operators.push("-");
      items[i].replace('-', '')
    }
  }

  for (let i = 0; i < items.length; i++) {
    items[i] = items[i].replace(/[+-]/g, '');
  }

  for (let i = 0; i < items.length; i++) {
    if (!items[i].includes('d')) {
      equationNums.push(items[i]);
    }
    if (items[i].includes('d')) {
      if (items[i].charAt(0) === 'd') {
        const numSides = parseInt(items[i].substring(1));
        const roll = Math.floor(Math.random() * numSides) + 1;
        rolls.push(roll);
        equationNums.push(roll);
      } else {
        const nums = items[i].split('d');
        for (let i = 0; i < nums[0]; i++) {
          const roll = Math.floor(Math.random() * nums[1]) + 1;
          rolls.push(roll);
          runningTotal += roll;
        }
        equationNums.push(runningTotal);
        runningTotal = 0;
      }

    }
  }

  for (let i = 0; i < equationNums.length; i++) {
    equationNums[i] = parseInt(equationNums[i]);
  }

  console.log(equationNums)

  for (let i = 0; i < equationNums.length; i++) {
    if (i == 0) {
      total += equationNums[i];
    } else {
      if (operators[i - 1] === '+') {
        total += equationNums[i];
      }
      if (operators[i - 1] === '-') {
        total -= equationNums[i];
      }
    }
  }
  const rollString = rolls.length === 0 ? '' : `(${rolls.join(' ')})`;
  const details = message.content.slice(PREFIX.length);
  if(!isNaN(total)){
    message.channel.send(`\`\`\`md\n# ${total}\nDetails:[${details} ${rollString}]\`\`\``);
  }
  console.log(items);
});

bot.login(process.env.token);