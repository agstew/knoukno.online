import React from "react";
import { Link, Text } from "@react-email/components";
import Layout from "./Layout.js";

const h = React.createElement;

export default function WelcomeEmail({ name }) {
  return h(
    Layout,
    null,
    h(Text, null, `Hi ${name},`),
    h(
      Text,
      null,
      "Your KnoUKno account is ready. Name your business and answer your first question - your free trial includes 5 questions for 3 days.",
    ),
    h(Text, null, "Know you know.", h("br"), "KnoUKno"),
  );
}
