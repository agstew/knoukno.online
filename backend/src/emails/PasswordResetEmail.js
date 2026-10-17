import React from "react";
import { Link, Text } from "@react-email/components";
import Layout from "./Layout.js";

const h = React.createElement;

export default function PasswordResetEmail({ name, resetUrl }) {
  return h(
    Layout,
    null,
    h(Text, null, `Hi ${name},`),
    h(Text, null, "We got a request to reset your KnoUKno password. This link expires in 1 hour:"),
    h(Text, null, h(Link, { href: resetUrl, style: { color: "#1e90ff" } }, "Reset your password")),
    h(Text, null, "If you didn't ask for this, you can ignore this email."),
    h(Text, null, "Know you know.", h("br"), "KnoUKno"),
  );
}
