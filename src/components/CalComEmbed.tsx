"use client";

export function CalComEmbed({ url }: { url: string }) {
  return (
    <div>
      <div className="calcom-box">
        <iframe
          src={url}
          title="Agenda de horários"
          loading="lazy"
          allow="camera; microphone; fullscreen"
        />
      </div>
      <p className="mt-4 text-center text-sm text-branco-lua/55">
        <a
          href={url.replace(/[?&]embed=true/, "")}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-dourado/40 underline-offset-4 hover:text-dourado"
        >
          Se a agenda não carregar, abra o calendário numa nova aba
        </a>
      </p>
    </div>
  );
}
