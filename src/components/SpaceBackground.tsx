"use client";
const heroCosmos = "/hero-cosmos.jpg";

/** Banner espacial fixo atrás de todas as páginas. */
export function SpaceBackground() {
  return (
    <div className="fundo-espacial" aria-hidden="true">
      <img
        src={heroCosmos}
        alt=""
        width={1920}
        height={1080}
        onError={(e) => {
          e.currentTarget.src = "/hero-cosmos.jpg";
        }}
      />
      <div className="fundo-espacial-veil" />
    </div>
  );
}
