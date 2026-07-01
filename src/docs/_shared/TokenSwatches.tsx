// Presentational helpers for the Design Tokens docs pages. Reads token values directly from
// src/tokens/* (imported by the MDX pages, not hardcoded here) so swatches never drift from
// the actual theme.

export function ColorScale({
  name,
  scale,
}: {
  name: string;
  scale: Record<string, string>;
}) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p style={{ fontFamily: "monospace", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
        {name}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {Object.entries(scale).map(([key, hex]) => (
          <div
            key={key}
            style={{
              width: "84px",
              borderRadius: "0.375rem",
              overflow: "hidden",
              border: "1px solid rgb(220 220 216)",
            }}
          >
            <div style={{ background: hex, height: "56px" }} />
            <div style={{ padding: "0.375rem 0.5rem", fontSize: "0.7rem", fontFamily: "monospace" }}>
              <div>{key}</div>
              <div style={{ opacity: 0.6 }}>{hex}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FontSpecimen({
  label,
  family,
  sample = "The quick brown fox jumps over the lazy dog",
}: {
  label: string;
  family: string;
  sample?: string;
}) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <p style={{ fontFamily: "monospace", fontSize: "0.75rem", opacity: 0.6 }}>{label}</p>
      <p style={{ fontFamily: family, fontSize: "1.5rem", margin: 0 }}>{sample}</p>
    </div>
  );
}

export function TypeScaleRow({
  name,
  size,
  lineHeight,
}: {
  name: string;
  size: string;
  lineHeight: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "1rem",
        padding: "0.5rem 0",
        borderBottom: "1px solid rgb(238 238 236)",
      }}
    >
      <code style={{ width: "90px", fontSize: "0.75rem", opacity: 0.6, flexShrink: 0 }}>
        {name} · {size} / {lineHeight}
      </code>
      <span style={{ fontSize: size, lineHeight, fontFamily: "Gloock, Georgia, serif" }}>
        Reporting from the source
      </span>
    </div>
  );
}

export function SpacingRow({ token, value }: { token: string | number; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.25rem 0" }}>
      <code style={{ width: "48px", fontSize: "0.75rem", opacity: 0.6 }}>{token}</code>
      <div style={{ background: "#b91c1c", height: "12px", width: value, minWidth: "1px" }} />
      <code style={{ fontSize: "0.7rem", opacity: 0.5 }}>{value}</code>
    </div>
  );
}

export function RadiusRow({ token, value }: { token: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.25rem 0" }}>
      <code style={{ width: "60px", fontSize: "0.75rem", opacity: 0.6 }}>{token}</code>
      <div
        style={{
          background: "#eeeeec",
          border: "1px solid #dcdcd8",
          height: "40px",
          width: "40px",
          borderRadius: value,
        }}
      />
      <code style={{ fontSize: "0.7rem", opacity: 0.5 }}>{value}</code>
    </div>
  );
}

export function ShadowRow({ token, value }: { token: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 0" }}>
      <code style={{ width: "60px", fontSize: "0.75rem", opacity: 0.6 }}>{token}</code>
      <div
        style={{
          background: "#ffffff",
          height: "48px",
          width: "96px",
          borderRadius: "0.375rem",
          boxShadow: value,
        }}
      />
    </div>
  );
}
