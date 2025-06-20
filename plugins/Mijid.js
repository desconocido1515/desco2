const handler = async (m, { conn }) => {
  try {
    const botJid = conn.user?.id || 'JID no disponible';
    const botNumber = botJid.split('@')[0];
    const botName = conn.user?.name || 'Nombre no disponible';

    let info = `🤖 *Información del Bot:*\n\n`;
    info += `🔹 *JID:* ${botJid}\n`;
    info += `🔹 *@wa:* wa.me/${botNumber}\n`;
    info += `🔹 *Nombre:* ${botName}`;

    m.reply(info);
  } catch (e) {
    m.reply('❌ Error al obtener la información del bot.');
  }
};

handler.command = /^infobot$/i;
handler.help = ['infobot'];
handler.tags = ['info'];

export default handler;
