
let handler = async(m, { user, isOwner, isAdmin, conn, text, participants, args, command }) => {
if (!(isAdmin || isOwner || user)) {
global.dfail('admin', m, conn)
throw false
}
let pesan = args.join` `
let oi = `${pesan}`
let teks = `${oi}\n`
teks += `1) 𝖭𝗈 𝗁𝖺𝗀𝖺 𝗇𝗂 𝗂𝗇𝗍𝖾𝗇𝗍𝖾 𝗆𝖺𝗇𝖽𝖺𝗋 𝗅𝗂𝗇𝗄𝗌, 𝗅𝗅𝖺𝗆𝖺𝖽𝖺𝗌 𝗈 𝖽𝗆 𝗁𝖺𝖼𝗂𝖺 𝖾𝗅 𝗉𝗋𝗂𝗏𝖺𝖽𝗈 𝖽𝖾 𝖤𝗅𝗂𝗍𝖾𝖡𝗈𝗍𝖦𝗅𝗈𝖻𝖺𝗅.

2) 𝖤𝗅 𝗌𝗍𝖺𝖿𝖿 𝖽𝖾 𝖤𝖡𝖦 𝗇𝗈 𝗌𝖾 𝗁𝖺𝖼𝖾 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖺𝖻𝗅𝖾 𝗉𝗈𝗋 𝖾𝗅 𝗆𝖺𝗅 𝗎𝗌𝗈 𝖽𝖾𝗅 𝖻𝗈𝗍. 

3) 𝖴𝗌𝗎𝖺𝗋𝗂𝗈 𝗊𝗎𝖾 𝗂𝗇𝖼𝗎𝗆𝗉𝗅𝖺 𝗅𝗈𝗌 𝗍𝖾́𝗋𝗆𝗂𝗇𝗈𝗌 𝗒 𝖼𝗈𝗇𝖽𝗂𝖼𝗂𝗈𝗇𝖾𝗌 𝗌𝖾 𝗉𝖺𝗌𝖺𝗋𝖺́ 𝗋𝖾𝗉𝗈𝗋𝗍𝖾 𝖺𝗅 𝖼𝗅𝗂𝖾𝗇𝗍𝖾 𝗊𝗎𝖾 𝖼𝗈𝗆𝗉𝗋𝗈 𝖾𝗅 𝖻𝗈𝗍 𝖼𝗈𝗇 𝗉𝗋𝗎𝖾𝖻𝖺𝗌.

📝 𝗡𝗢𝗧𝗔 : 
𝖯𝗈𝗋 𝖼𝖺𝖽𝖺 𝗂𝗇𝖼𝗎𝗆𝗉𝗅𝗂𝖾𝗇𝖽𝗈 𝗌𝖾 𝖽𝖺𝗋𝖺́ 3 𝖠𝖣𝖵𝖤𝖱𝖳𝖤𝖭𝖢𝖨𝖠𝖲, 𝖺𝗅 𝗍𝖾𝗋𝖼𝖾𝗋 𝗂𝗇𝖼𝗎𝗆𝗉𝗅𝗂𝗆𝗂𝖾𝗇𝗍𝗈 𝗌𝖾 𝗋𝖾𝗍𝗂𝗋𝖺𝗋𝖺́ 𝖾𝗅 𝖻𝗈𝗍.

Para verificar si algún integrante incumplió las normas del bot poner el comando:
 .bloqueados 

𝖠𝗍𝗍 : 𝗌𝗍𝖺𝖿𝖿 𝖽𝖾 𝖤𝖡𝖦
`
conn.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, )
}
handler.help = ['smsf20 <mesaje>','fem20 <mesaje>']
handler.tags = ['group']
handler.command = /^(staff|terminos|leer)$/i
handler.admin = false
handler.group = true
export default handler

