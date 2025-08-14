import { useState } from "react";
import "../styles/video-gallery-lite.css";

type Provider = "youtube" | "facebook";

type VideoItem = {
  provider: Provider;
  id: string;            // YouTube: ID (yCw2wcaS_9w). Facebook: URL completa del video.
  title: string;
  description?: string;
  startAt?: number;      // solo YouTube (segundos)
  thumb?: string;        // opcional (útil para Facebook si tienes una imagen)
};

type Props = { items: VideoItem[] };

function ytThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function ytEmbedSrc(id: string, startAt?: number) {
  const u = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
  u.searchParams.set("rel", "0");
  u.searchParams.set("modestbranding", "1");
  u.searchParams.set("autoplay", "1");
  if (startAt) u.searchParams.set("start", String(startAt));
  return u.toString();
}

function fbEmbedSrc(videoUrl: string) {
  // Reproduce el video de Facebook inline sin SDK. Debe ser público.
  const base = "https://www.facebook.com/plugins/video.php";
  const url =
    `${base}?href=${encodeURIComponent(videoUrl)}&show_text=false&autoplay=true&allowfullscreen=true&height=315&width=560`;
  return url;
}

function externalWatchUrl(v: VideoItem) {
  if (v.provider === "youtube") {
    const u = new URL("https://www.youtube.com/watch");
    u.searchParams.set("v", v.id);
    if (v.startAt) u.searchParams.set("t", `${v.startAt}s`);
    return u.toString();
  }
  // Facebook: abrimos el mismo URL del video
  return v.id;
}

export default function VideoGalleryLite({ items }: Props) {
  const [playing, setPlaying] = useState<Record<string, boolean>>({});

  const handlePlay = (key: string) =>
    setPlaying((p) => ({ ...p, [key]: true }));

  return (
    <section id="videos" className="section">
      <div className="container">
        <h2 className="vgl-title">Videos: diagnóstico y psiquiatría</h2>
        <p className="vgl-sub">
          Reprodúcelos aquí mismo. O ábrelos en su plataforma para ver comentarios y participar.
        </p>

        <div className="vgl-grid">
          {items.map((v, i) => {
            const k = `${v.provider}:${v.id}`;
            const isPlaying = !!playing[k];
            const isYT = v.provider === "youtube";
            const thumbSrc = isYT ? ytThumb(v.id) : (v.thumb || "");

            return (
              <article key={k} className="vgl-card">
                <div className="vgl-player">
                  {!isPlaying ? (
                    <button
                      type="button"
                      className="vgl-lite"
                      onClick={() => handlePlay(k)}
                      aria-label={`Reproducir: ${v.title}`}
                    >
                      {/* Para YouTube usamos miniatura HQ; para Facebook, un fondo limpio (o provee v.thumb) */}
                      {thumbSrc ? (
                        <img
                          src={thumbSrc}
                          alt={v.title}
                          loading="lazy"
                          width={480}
                          height={270}
                        />
                      ) : (
                        <div className="vgl-fallback">
                          <span className="vgl-platform">{isYT ? "YouTube" : "Facebook"}</span>
                        </div>
                      )}
                      <span className="vgl-play">▶</span>
                    </button>
                  ) : (
                    <iframe
                      src={isYT ? ytEmbedSrc(v.id, v.startAt) : fbEmbedSrc(v.id)}
                      title={v.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}
                </div>

                <div className="vgl-meta">
                  <h3 className="vgl-card-title">{v.title}</h3>
                  {v.description && <p className="vgl-card-desc">{v.description}</p>}
                  <a
                    className="vgl-link"
                    href={externalWatchUrl(v)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver en {isYT ? "YouTube" : "Facebook"} →
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
