const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive");
});

app.listen(process.env.PORT || 3000);
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🧠 YOUR SERVER
const GUILD_ID = "1517293432366825713";

// 🕒 CHANNEL SCHEDULES
const schedules = [
  {
    channelId: "1518018887122292878", // #16
    open: "20:00",
    close: "23:59"
  },
  {
    channelId: "1518018934190641317", // #20
    open: "08:00",
    close: "12:00"
  },
  {
    channelId: "1518018981041017012", // #23
    open: "09:00",
    close: "13:00"
  }
];

// ⏰ TIME FUNCTION (UK server time of host machine)
function getTime() {
  return new Date().toTimeString().slice(0, 5);
}

// 🚀 BOT READY
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// 🔁 CHECK EVERY MINUTE
cron.schedule("* * * * *", async () => {
  const now = getTime();

  const guild = await client.guilds.fetch(GUILD_ID).catch(() => null);
  if (!guild) return;

  for (const rule of schedules) {
    const channel = await guild.channels.fetch(rule.channelId).catch(() => null);
    if (!channel) continue;

    // 🔓 OPEN CHANNEL
    if (now === rule.open) {
      await channel.permissionOverwrites.edit(guild.roles.everyone, {
        SendMessages: true
      });

      console.log(`OPENED ${rule.channelId} at ${now}`);
    }

    // 🔒 CLOSE CHANNEL
    if (now === rule.close) {
      await channel.permissionOverwrites.edit(guild.roles.everyone, {
        SendMessages: false
      });

      console.log(`CLOSED ${rule.channelId} at ${now}`);
    }
  }
});

// 🔑 LOGIN (IMPORTANT FOR RENDER)
client.login(process.env.DISCORD_TOKEN);
