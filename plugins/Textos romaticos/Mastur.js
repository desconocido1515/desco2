let handler = async (m, { conn, usedPrefix, text }) => {
  let { key } = await conn.sendMessage(m.chat, { text: "Ahora me voy a hacer una paja " }, { quoted: m });
  const array = [
    "8==👊==D", "8===👊=D", "8=👊===D", "8=👊===D", "8==👊==D", "8===👊=D", "8=👊===D", "8==👊==D", "8===👊=D", "8=👊===D","8==👊==D","8===👊=D","8===👊=D💦"
  ];

  for (let item of array) {
    await conn.sendMessage(m.chat, { text: `${item}`, edit: key }, { quoted: m });
    await new Promise(resolve => setTimeout(resolve, 20)); // Delay 5 seconds
  }
  return conn.sendMessage(m.chat, { text: `𝙌𝙪𝙚 𝙧𝙞𝙘𝙖 𝙥𝙖𝙟𝙖 𝙖 𝙩𝙪 𝙣𝙤𝙢𝙗𝙧𝙚 𝙗𝙚𝙗𝙚́ 😈💦🔥 ${text}`.trim() , edit: key, mentions: [m.sender] }, { quoted: m });
};

handler.help = ['fun', 'fap'];
handler.tags = ['fun', 'sega'];
handler.command = /^(masturbar|mastur)$/i;

export default handler;
