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
     const text2 = `💌 *⌈*  𝑪𝑨𝑹𝑻𝑨 𝑫𝑬 𝑨𝑴𝑶𝑹 *⌋* 💌
    
𝑫𝑬: @${m.sender.split("@")[0]} 
𝑷𝑨𝑹𝑨: ${text}

 𝑩𝒐𝒓𝒓𝒂𝒄𝒉𝒐 𝒚 𝒍𝒐𝒄𝒐 𝒕𝒆 𝒓𝒆𝒄𝒖𝒆𝒓𝒅𝒐, 𝒓𝒆𝒄𝒖𝒆𝒓𝒅𝒐 𝒄𝒂𝒅𝒂 𝒄𝒂𝒓𝒊𝒄𝒊𝒂 𝒒𝒖𝒆 𝒉𝒂𝒄𝒊𝒂 𝒒𝒖𝒆 𝒎𝒊 𝒑𝒊𝒆𝒍 𝒔𝒆 𝒄𝒐𝒏𝒗𝒊𝒓𝒕𝒊𝒆𝒓𝒂 𝒆𝒏 𝒖𝒏𝒊𝒄𝒂, 𝒓𝒆𝒄𝒖𝒆𝒓𝒅𝒐 𝒄𝒂𝒅𝒂 𝒃𝒆𝒔𝒐 𝒒𝒖𝒆 𝒉𝒂𝒄𝒊𝒂 𝒒𝒖𝒆 𝒎𝒊𝒔 𝒍𝒂𝒃𝒊𝒐𝒔 𝒇𝒖𝒆𝒓𝒂𝒏 𝒇𝒖𝒆𝒏𝒕𝒆 𝒅𝒆 𝒅𝒆𝒔𝒆𝒐, 𝒓𝒆𝒄𝒖𝒆𝒓𝒅𝒐 𝒄𝒖𝒂𝒏𝒕𝒐 𝒕𝒆 𝒂𝒎𝒐 𝒚 𝒄𝒖𝒂𝒏𝒕𝒐 𝒕𝒆 𝒅𝒆𝒔𝒆𝒐, 𝒕𝒆 𝒓𝒆𝒄𝒖𝒆𝒓𝒅𝒐 𝒉𝒐𝒚 𝒚 𝒔𝒊𝒆𝒎𝒑𝒓𝒆 𝒄𝒖𝒂𝒏𝒅𝒐 𝒆𝒔𝒕𝒂𝒔 𝒎𝒖𝒚 𝒄𝒆𝒓𝒄𝒂 𝒚 𝒄𝒖𝒂𝒏𝒅𝒐 𝒆𝒔𝒕𝒂𝒔 𝒎𝒖𝒚 𝒍𝒆𝒋𝒐𝒔.`.trim()
 conn.sendMessage(m.chat, {text: text2, mentions: [_user, m.sender]}, {quoted: m})
const stiker = await sticker(null, url, `+${m.sender.split('@')[0]} le dio besos a ${m.mentionedJid.map((user)=>(user === m.sender)? 'alguien ': `+${user.split('@')[0]}`).join(', ')}`); 
conn.sendFile(m.chat, stiker, null, {asSticker: true}); 
   } catch (e) { } 
 }; 
 handler.command = /^(carta2)$/i; 
 export default handler;
