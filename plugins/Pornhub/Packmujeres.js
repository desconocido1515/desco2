import axios from 'axios';
import fetch from 'node-fetch';
const handler = async (m, {command, conn}) => {
  if (!db.data.chats[m.chat].modohorny && m.isGroup) throw '*[❗𝐈𝐍𝐅𝐎❗] 𝙻𝙾𝚂 𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂 +𝟷𝟾 𝙴𝚂𝚃𝙰𝙽 𝙳𝙴𝚂𝙰𝙲𝚃𝙸𝚅𝙰𝙳𝙾𝚂 𝙴𝙽 𝙴𝚂𝚃𝙴 𝙶𝚁𝚄𝙿𝙾, 𝚂𝙸 𝙴𝚂 𝙰𝙳𝙼𝙸𝙽 𝚈 𝙳𝙴𝚂𝙴𝙰 𝙰𝙲𝚃𝙸𝚅𝙰𝚁𝙻𝙾𝚂 𝚄𝚂𝙴 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 #enable modohorny*';

  if (command == 'pack') {
    const res = (await axios.get(`https://raw.githubusercontent.com/BOTGATITO/botgatito/master/src/JSON/Packmujeres.json`)).data;
    const url = await res[Math.floor(res.length * Math.random())];
    conn.sendMessage(m.chat, {image: {url: url}, caption: `𝙀𝙎𝙏𝘼 𝙋𝙐𝙏𝘼 𝙌𝙐𝙄𝙀𝙍𝙀 𝙌𝙐𝙀 𝙇𝘼 𝙈𝙀𝙏𝘼𝙎 𝘿𝙐𝙍𝙊. 🔥`.trim()}, {quoted: m});
  }
  };
handler.help = ['puta'];
//handler.command = ['pack'];
handler.tags = ['nsfw'];
export default handler;
