import React from "react";
import { Text } from "@react-email/components";
import Layout from "./Layout.js";

const h = React.createElement;

// Splits on newlines and keeps them as <br/> breaks within one paragraph.
function withLineBreaks(message) {
  const lines = message.split("\n");
  return lines.flatMap((line, i) => (i < lines.length - 1 ? [line, h("br", { key: i })] : [line]));
}

export default function BroadcastEmail({ name, message }) {
  return h(
    Layout,
    null,
    h(Text, null, `Hi ${name},`),
    h(Text, null, ...withLineBreaks(message)),
    h(Text, null, "Know you know.", h("br"), "Kno U Kno"),
  );
}
