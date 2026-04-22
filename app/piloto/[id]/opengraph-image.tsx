import { ImageResponse } from "next/og";
import { fetchPilotById } from "./fetch-pilot";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Caserna Kart Racing — Piloto";

type Props = { params: Promise<{ id: string }> };

export default async function Image({ params }: Props) {
  const { id } = await params;
  const pilot = await fetchPilotById(id);

  // Fallback when pilot can't be resolved.
  if (!pilot) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg,#04060b 0%,#0a0f1c 55%,#05070a 100%)",
          color: "#fff",
          fontSize: 64,
          fontWeight: 900,
          letterSpacing: "0.1em",
        }}
      >
        CASERNA KART RACING
      </div>,
      { ...size }
    );
  }

  const warName = pilot.nomeGuerra && pilot.nomeGuerra !== pilot.piloto ? pilot.nomeGuerra : "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 64,
        background: "linear-gradient(180deg,#04060b 0%,#0a0f1c 55%,#05070a 100%)",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          height: 4,
          width: "100%",
          background: "linear-gradient(90deg,transparent,#facc15,transparent)",
          marginBottom: 32,
        }}
      />

      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)",
        }}
      >
        <span>Caserna Kart Racing</span>
        <span>{pilot.competicao}</span>
      </div>

      {/* Category pill */}
      <div
        style={{
          display: "flex",
          alignSelf: "flex-start",
          marginTop: 28,
          padding: "8px 20px",
          borderRadius: 999,
          border: "1px solid rgba(250,204,21,0.35)",
          background: "rgba(250,204,21,0.1)",
          color: "#fde047",
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        {pilot.categoria}
      </div>

      {/* Pilot name */}
      <div
        style={{
          display: "flex",
          marginTop: 24,
          fontSize: 96,
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: "-0.02em",
        }}
      >
        {pilot.piloto}
      </div>

      {warName ? (
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 32,
            fontWeight: 700,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.04em",
          }}
        >
          &ldquo;{warName}&rdquo;
        </div>
      ) : null}

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          marginTop: "auto",
          gap: 20,
        }}
      >
        {[
          { label: "Posição", value: `#${pilot.pos}` },
          { label: "Pontos", value: String(pilot.pontos) },
          { label: "Vitórias", value: String(pilot.vitorias) },
          { label: "Pódios", value: String(pilot.podios) },
          { label: "VMR", value: String(pilot.mv) },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: 20,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {stat.label}
            </span>
            <span
              style={{
                marginTop: 8,
                fontSize: 48,
                fontWeight: 900,
                letterSpacing: "-0.02em",
              }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>,
    { ...size }
  );
}
