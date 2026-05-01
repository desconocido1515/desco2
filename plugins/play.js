import fetch from "node-fetch";
import yts from "yt-search";

const yt = {
  static: Object.freeze({
    baseUrl: 'https://cnv.cx',
    headers: {
      'accept-encoding': 'gzip, deflate, br, zstd',
      'origin': 'https://frame.y2meta-uk.com',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  }),

  key: null,

  resolvePayload(link, f) {
    const tipo = f.endsWith('k') ? 'mp3' : 'mp4';
    return {
      link,
      format: tipo,
      audioBitrate: tipo === 'mp3' ? f.replace('k', '') : '128',
      videoQuality: tipo === 'mp4' ? f.replace('p', '') : '480',
      filenameStyle: 'pretty',
      vCodec: 'h264'
    };
  },

  sanitize(name) {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  },

  async getKey() {
    if (this.key) return this.key;

    const r = await fetch(this.static.baseUrl + '/v2/sanity/key', {
      headers: this.static.headers
    });

    const j = await r.json();
    if (!j?.key) throw new Error('Key inválida');

    this.key = j.key;
    return j.key;
  },

  async convert(url, f) {
    const key = await this.getKey();
    const payload = this.resolvePayload(url, f);

    const r = await fetch(this.static.baseUrl + '/v2/converter', {
      method: 'POST',
      headers: { ...this.static.headers, key },
      body: new URLSearchParams(payload)
    });

    const j = await r.json();

    if (!j?.url || !j.url.startsWith('http')) {
      throw new Error('cnv sin enlace válido');
    }

    return j;
  }
};

// ==================== APIS ====================

// GOHAN
const gohanDownload = async (url) => {
  const api = `https://api-gohan.onrender.com/download/ytaudio?url=${encodeURIComponent(url)}`;
  const r = await fetch(api);
  const j = await r.json();

  if (!j?.result?.download_url) throw new Error('Gohan falló');

  return {
    url: j.result.download_url,
    filename: j.result.title
  };
};

// DELIRIUS
const deliriusDownload = async (url) => {
  const api = `https://api.delirius.store/download/ytmp3?url=${encodeURIComponent(url)}`;
  const r = await fetch(api);
  const j = await r.json();

  if (!j?.status || !j?.data?.download) throw new Error('Delirius falló');

  return {
    url: j.data.download,
    filename: j.data.title
  };
};

// CNV
const cnvDownload = async (url, title) => {
  const data = await yt.convert(url, '128k');

  const r = await fetch(data.url, {
    headers: { 'user-agent': 'Mozilla/5.0' }
  });

  if (!r.ok) throw new Error('cnv HTTP error');

  const buffer = Buffer.from(await r.arrayBuffer());

  return {
    audioData: buffer,
    fileName: yt.sanitize(data.filename || title)
  };
};

// ==================== RACE ====================
const descargarMasRapido = async (url, title) => {
  const apis = [
    { name: 'cnv', fn: () => cnvDownload(url, title) },
    { name: 'gohan', fn: () => gohanDownload(url) },
    { name: 'delirius', fn: () => deliriusDownload(url) }
  ];

  const race = await Promise.race(
    apis.map(async (api) => {
      const start = Date.now();
      try {
        const res = await api.fn();
        return { ok: true, res, api: api.name, time: Date.now() - start };
      } catch {
        return { ok: false };
      }
    })
  );

  if (race.ok) {
    console.log(`⚡ ${race.api} ganó (${race.time}ms)`);
    return race.res;
  }

  // fallback
  for (const api of apis) {
    try {
      return await api.fn();
    } catch {}
  }

  throw new Error('Todas las APIs fallaron');
};

// ==================== HANDLER ====================
const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `⭐ Envía el nombre de la canción\n\nEjemplo:\n${usedPrefix + command} Bad Bunny - Monaco`;
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    const search = await yts(text.trim());
    const video = search.videos[0];

    if (!video) throw "No se encontró el video";
    if (video.seconds > 600) throw "❌ Máximo 10 minutos";

    // preview
    await conn.sendMessage(m.chat, {
      text: `▶️ *${video.title}*`,
      contextInfo: {
        externalAdReply: {
          title: video.title,
          thumbnailUrl: video.thumbnail,
          sourceUrl: video.url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    const result = await descargarMasRapido(video.url, video.title);

    let buffer, name;

    if (result.audioData) {
      buffer = result.audioData;
      name = result.fileName;
    } else {
      const r = await fetch(result.url);
      buffer = Buffer.from(await r.arrayBuffer());
      name = yt.sanitize(result.filename || video.title);
    }

    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      fileName: `${name}.mp3`
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);

    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });

    throw `❌ Error:\n${e.message || e}`;
  }
};

handler.command = ['play', 'playaudio', 'ytmusic'];
export default handler;
