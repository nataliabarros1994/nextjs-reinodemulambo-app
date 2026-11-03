import type { Metadata } from "next";
import { Reading } from "@/views/Reading";
import { pageOpenGraph } from "@/lib/open-graph";

const title = "A leitura — como funciona uma consulta de búzios e tarô online";
const description =
  "Como funciona uma consulta de búzios e tarô online: o que o oráculo responde, o que eu não faço, como perguntar e como se preparar. Atendimento por texto, áudio ou vídeo.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/leitura" },
  openGraph: pageOpenGraph("/leitura", { title, description }),
};

export default function Page() {
  return <Reading />;
}
