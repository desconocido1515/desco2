import fetch from 'node-fetch'; 
 import MessageType from '@whiskeysockets/baileys'; 
 const handler = async (m, {conn, text, groupMetadata}) => { 
   try {
    let _user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
  let who; 

   if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender; 
   else who = m.sender; 
   let name = conn.getName(who);
     if (m.quoted?.sender) m.mentionedJid.push(m.quoted.sender); 
     if (!m.mentionedJid.length) m.mentionedJid.push(m.sender); 
     const res = await fetch('https://nekos.life/api/kiss'); 
     const json = await res.json(); 
     const {url} = json; 
     const text2 = `💌 *⌈* 𝑩𝑼𝑬𝑵𝑨 𝑴𝑨𝑫𝑹𝑼𝑮𝑨𝑫𝑨 *⌋* 💌
    
𝑫𝑬: @${m.sender.split("@")[0]} 
𝑷𝑨𝑹𝑨: ${text}

𝑺𝒐𝒍𝒐 𝒒𝒖𝒊𝒆𝒓𝒐 𝒅𝒆𝒔𝒆𝒂𝒓𝒕𝒆 𝒖𝒏𝒂 𝒇𝒆𝒍𝒊𝒛 𝒎𝒂𝒅𝒓𝒖𝒈𝒂𝒅𝒂 𝒚 𝒑𝒂𝒓𝒂  𝒓𝒆𝒄𝒐𝒓𝒅𝒂𝒓𝒕𝒆 𝒒𝒖𝒆 𝒆𝒏 𝒎𝒊 𝒄𝒐𝒓𝒂𝒛𝒐́𝒏 𝒔𝒊𝒆𝒎𝒑𝒓𝒆 𝒆𝒔𝒕𝒂𝒔 𝒕𝒖, 𝒇𝒆𝒍𝒊𝒛 𝒎𝒂𝒅𝒓𝒖𝒈𝒂𝒅𝒂 𝒄𝒂𝒓𝒊𝒏̃𝒐, 𝒅𝒆𝒔𝒄𝒂𝒏𝒔𝒂. `.trim()
 conn.sendMessage(m.chat, {text: text2, mentions: [_user, m.sender]}, {quoted: m})
const stiker = await sticker(null, url, `+${m.sender.split('@')[0]} le dio besos a ${m.mentionedJid.map((user)=>(user === m.sender)? 'alguien ': `+${user.split('@')[0]}`).join(', ')}`); 
conn.sendFile(m.chat, stiker, null, {asSticker: true}); 
   } catch (e) { } 
 }; 
 handler.command = /^(buenamadrugada|buena madrugada)$/i; 
 export default handler;
