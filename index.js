const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const GUILD_ID = "1517293432366825713";

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

function getTime() {
  return new Date().toTimeString().slice(0, 5); // HH:MM (UK system time)
}

// Prevent duplicate triggers
const lastRun = {};

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

cron.schedule("* * * * *", async () => {
  const now = getTime();

  const guild = await client.guilds.fetch(GUILD_ID).catch(() => null);
  if (!guild) return;

  for (const rule of schedules) {
    const channel = await guild.channels.fetch(rule.channelId).catch(() => null);
    if (!channel) continue;

    // 🔓 OPEN
    if (now === rule.open && lastRun[rule.channelId + "open"] !== now) {
      lastRun[rule.channelId + "open"] = now;

      await channel.permissionOverwrites.edit(guild.roles.everyone, {
        SendMessages: true
      });

      console.log(`OPENED channel ${rule.channelId} at ${now}`);
    }

    // 🔒 CLOSE
    if (now === rule.close && lastRun[rule.channelId + "close"] !== now) {
      lastRun[rule.channelId + "close"] = now;

      await channel.permissionOverwrites.edit(guild.roles.everyone, {
        SendMessages: false
      });

      console.log(`CLOSED channel ${rule.channelId} at ${now}`);
    }
  }
});

// 🔑 PUT YOUR BOT TOKEN HERE
client.login("MTUxNzk5OTI4OTM1NDI4OTIxMg.GKacod.ffRW0osy1QOIbh5EcxvIZEp8YltUvjLr3sVVVE");

