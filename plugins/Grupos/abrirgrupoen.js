let handler = async (m, { conn, isAdmin, isOwner, args, usedPrefix, command }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  if (args[0] === undefined || isNaN(args[0])) {
    m.reply('🕔 𝘐𝘯𝘨𝘳𝘦𝘴𝘢 𝘭𝘢 𝘩𝘰𝘳𝘢 𝘲𝘶𝘦 𝘥𝘦𝘴𝘦𝘢𝘴 𝘲𝘶𝘦 𝘌𝘭𝘪𝘵𝘦 𝘉𝘰𝘵 𝘢𝘣𝘳𝘢 𝘵𝘶 𝘨𝘳𝘶𝘱𝘰.\n\n» 𝘌𝘫𝘦𝘮𝘱𝘭𝘰:\n.abrirgrupoen 2');
    throw false;
  }

  let timeoutset = 86400000 * args[0] / 24;
  await conn.groupSettingUpdate(m.chat, 'announcement');
  m.reply(`❱❱ 𝗢𝗥𝗗𝗘𝗡𝗘𝗦 𝗥𝗘𝗖𝗜𝗕𝗜𝗗𝗔𝗦 ❰❰\n Este grupo se abrira en:\n*» ${args[0]} horas*`);

  setTimeout(async () => {
    await conn.groupSettingUpdate(m.chat, 'not_announcement');
    conn.reply(m.chat, '"El que persevera alcanza"\n- Steve Jobs');
  }, timeoutset);
};

handler.help = ['abrirgrupoen <horas>'];
handler.tags = ['group'];
handler.command = /^(abrirgrupoen)$/i;
handler.botAdmin = true;
handler.group = true;

export default handler;
