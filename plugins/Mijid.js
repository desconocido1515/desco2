const handler = async (m, { conn }) => {
  m.reply(`Tu JID es:\n\n${m.sender}`);
};

handler.command = /^myjid$/i;
handler.help = ['myjid'];
handler.tags = ['info'];

export default handler;
