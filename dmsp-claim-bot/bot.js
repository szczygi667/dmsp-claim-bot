import {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
} from "discord.js";

import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_, res) => {
  res.send("✅ Bot is alive and hosted by Railway!");
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  const user = interaction.user;
  const embed = EmbedBuilder.from(interaction.message.embeds[0]);
  const embedClient = EmbedBuilder.from(interaction.message.embeds[1]);

  if (interaction.customId.startsWith("claim_order")) {
    const baseId = interaction.customId.split("_")[2];

    embedClient.spliceFields(
      0,
      2,
      {
        name: "Login",
        value: "||*Hidden after claim*||",
        inline: true,
      },
      {
        name: "Password",
        value: "||*Hidden after claim*||",
        inline: true,
      }
    );

    embed.setFooter({ text: `Claimed by: ${user.tag}` });

    const newRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`done_order_${baseId}`)
        .setLabel("✅ Done")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`cancel_order_${baseId}`)
        .setLabel("❌ Cancel")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.update({
      content: `✅ Order claimed by <@${user.id}>`,
      embeds: [embed, embedClient],
      components: [newRow],
    });
  } else if (interaction.customId.startsWith("done_order")) {
    embed.setFooter({ text: `✅ Completed by: ${user.tag}` });

    await interaction.update({
      content: `✅ Order completed by <@${user.id}>`,
      embeds: [embed, embedClient],
      components: [],
    });
  } else if (interaction.customId.startsWith("cancel_order")) {
    embed.setFooter({ text: `❌ Cancelled by: ${user.tag}` });

    await interaction.update({
      content: `❌ Order cancelled by <@${user.id}>`,
      embeds: [embed, embedClient],
      components: [],
    });
  }
});

client.login(process.env.TOKEN);
