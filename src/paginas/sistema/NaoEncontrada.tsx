import Recado from "./Recado";

export default function NaoEncontrada() {
  return (
    <Recado
      emoji="🧭"
      titulo="Este caminho não existe"
      texto="Pode ter mudado de lugar, ou o endereço veio com um errinho. Tudo bem — o início continua aqui."
    />
  );
}
