/**
 * Logos dos patrocinadores oficiais do campeonato.
 * Cada entry contém caminhos, dimensões e estilos para modos light/dark.
 */
export const sponsorLogos = [
  {
    name: "LazyKart",
    src: "/patrocinadores/lazykart.png",
    wrapper: "px-3 py-2",
    image:
      "h-auto max-h-[54px] w-auto max-w-[97%] object-contain scale-[1.1] drop-shadow-[0_2px_6px_rgba(15,23,42,0.10)] md:max-h-[60px]",
    shareImage:
      "h-auto max-h-[70px] w-auto max-w-[97%] object-contain scale-[1.14] drop-shadow-[0_3px_8px_rgba(15,23,42,0.12)]",
    surfaceLight:
      "border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(250,250,252,0.995)_52%,rgba(241,245,249,0.985)_100%)]",
    surfaceDark:
      "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.03)_100%)]",
  },
  {
    name: "Lumine",
    src: "/patrocinadores/lumine.png",
    wrapper: "px-3 py-2",
    image:
      "h-auto max-h-[58px] w-auto max-w-[97%] object-contain scale-[1.14] drop-shadow-[0_4px_12px_rgba(0,0,0,0.24)] md:max-h-[64px]",
    shareImage:
      "h-auto max-h-[76px] w-auto max-w-[98%] object-contain scale-[1.18] drop-shadow-[0_5px_14px_rgba(0,0,0,0.26)]",
    surfaceLight:
      "border-zinc-950/95 bg-[linear-gradient(180deg,rgba(17,24,39,1)_0%,rgba(12,18,31,1)_58%,rgba(8,13,25,1)_100%)]",
    surfaceDark:
      "border-white/10 bg-[linear-gradient(180deg,rgba(19,25,39,1)_0%,rgba(9,14,26,1)_100%)]",
  },
  {
    name: "Precision",
    src: "/patrocinadores/precision.png",
    wrapper: "px-1.5 py-1",
    image:
      "h-[60px] w-[136px] scale-[1.9] object-contain drop-shadow-[0_2px_6px_rgba(15,23,42,0.10)] md:h-[66px] md:w-[148px]",
    shareImage:
      "h-[76px] w-[172px] scale-[1.96] object-contain drop-shadow-[0_3px_8px_rgba(15,23,42,0.12)]",
    surfaceLight:
      "border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(250,250,252,0.995)_52%,rgba(241,245,249,0.985)_100%)]",
    surfaceDark:
      "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.03)_100%)]",
  },
  {
    name: "Skyflow",
    src: "/patrocinadores/skyflow.png",
    wrapper: "px-1.5 py-1",
    image:
      "h-[60px] w-[136px] scale-[1.86] object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.24)] md:h-[66px] md:w-[148px]",
    shareImage:
      "h-[76px] w-[172px] scale-[1.92] object-contain drop-shadow-[0_5px_14px_rgba(0,0,0,0.26)]",
    surfaceLight:
      "border-zinc-950/95 bg-[linear-gradient(180deg,rgba(17,24,39,1)_0%,rgba(12,18,31,1)_58%,rgba(8,13,25,1)_100%)]",
    surfaceDark:
      "border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,1)_0%,rgba(8,12,24,1)_100%)]",
  },
  {
    name: "Vits",
    src: "/patrocinadores/vits.png",
    wrapper: "px-1 py-1",
    image:
      "h-[58px] w-[130px] scale-[2.14] object-contain drop-shadow-[0_2px_6px_rgba(15,23,42,0.10)] md:h-[64px] md:w-[142px]",
    shareImage:
      "h-[74px] w-[166px] scale-[2.18] object-contain drop-shadow-[0_3px_8px_rgba(15,23,42,0.12)]",
    surfaceLight:
      "border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(250,250,252,0.995)_52%,rgba(241,245,249,0.985)_100%)]",
    surfaceDark:
      "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.03)_100%)]",
  },
  {
    name: "Astera",
    src: "/patrocinadores/astera.png",
    wrapper: "px-3 py-2",
    image:
      "h-auto max-h-[58px] w-auto max-w-[97%] object-contain scale-[1.14] drop-shadow-[0_4px_12px_rgba(0,0,0,0.24)] md:max-h-[64px]",
    shareImage:
      "h-auto max-h-[76px] w-auto max-w-[98%] object-contain scale-[1.18] drop-shadow-[0_5px_14px_rgba(0,0,0,0.26)]",
    surfaceLight:
      "border-zinc-950/95 bg-[linear-gradient(180deg,rgba(17,24,39,1)_0%,rgba(12,18,31,1)_58%,rgba(8,13,25,1)_100%)]",
    surfaceDark:
      "border-white/10 bg-[linear-gradient(180deg,rgba(19,25,39,1)_0%,rgba(9,14,26,1)_100%)]",
  },
] as const;
