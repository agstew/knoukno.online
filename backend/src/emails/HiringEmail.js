import React from "react";
import { Text } from "@react-email/components";
import Layout from "./Layout.js";

const h = React.createElement;

// Splits on newlines and keeps them as <br/> breaks within one paragraph.
function withLineBreaks(message) {
  const lines = message.split("\n");
  return lines.flatMap((line, i) => (i < lines.length - 1 ? [line, h("br", { key: i })] : [line]));
}

export default function HiringEmail({ name, email, role, message }) {
  return h(
    Layout,
    null,
    h(Text, null, "New message from the hiring form:"),
    h(Text, null, `From: ${name} <${email}>`),
    role ? h(Text, null, `Role interested in: ${role}`) : null,
    h(Text, null, ...withLineBreaks(message)),
  );
}
