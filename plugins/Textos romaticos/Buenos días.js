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
     const text2 = `💌 *⌈* 𝑩𝑼𝑬𝑵𝑶𝑺 𝑫𝑰́𝑨𝑺 *⌋* 💌
    
𝑫𝑬: @${m.sender.split("@")[0]} 
𝑷𝑨𝑹𝑨: ${text}

 𝑩𝒖𝒆𝒏𝒐𝒔 𝒅𝒊́𝒂𝒔. 𝑯𝒐𝒚 𝒎𝒆 𝒍𝒆𝒗𝒂𝒏𝒕𝒆́ 𝒚 𝒅𝒆𝒄𝒊𝒅𝒊́ 𝒒𝒖𝒆 𝒕𝒆 𝒅𝒊𝒓𝒊́𝒂 𝒄𝒖𝒂𝒏𝒕𝒐 𝒔𝒊𝒈𝒏𝒊𝒇𝒊𝒄𝒂𝒔 𝒑𝒂𝒓𝒂 𝒎𝒊́ 𝒚 𝒍𝒐 𝒎𝒖𝒄𝒉𝒐 𝒒𝒖𝒆 𝒕𝒆 𝒒𝒖𝒊𝒆𝒓𝒐.`.trim()
 conn.sendMessage(m.chat, {text: text2, mentions: [_user, m.sender]}, {quoted: m})
const stiker = await sticker(null, url, `+${m.sender.split('@')[0]} le dio besos a ${m.mentionedJid.map((user)=>(user === m.sender)? 'alguien ': `+${user.split('@')[0]}`).join(', ')}`); 
conn.sendFile(m.chat, stiker, null, {asSticker: true}); 
   } catch (e) { } 
 }; 
 handler.command = /^(buenosdias)$/i; 
 export default handler;
