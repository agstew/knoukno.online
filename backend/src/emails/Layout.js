import React from "react";
import { Body, Column, Container, Head, Html, Img, Row, Section, Text } from "@react-email/components";

const h = React.createElement;

const SITE_URL = process.env.FRONTEND_URL || "https://www.knoukno.online";
const LOGO_URL = `${SITE_URL}/favicon.svg`;

// Shared visual shell for all transactional/broadcast emails.
export default function Layout({ children }) {
  return h(
    Html,
    null,
    h(Head),
    h(
      Body,
      { style: { background: "#f4f5f7", padding: "32px 16px", fontFamily: "Arial, Helvetica, sans-serif", margin: 0 } },
      h(
        Container,
        {
          style: {
            maxWidth: 480,
            margin: "0 auto",
            background: "#ffffff",
            borderRadius: 12,
            overflow: "hidden",
          },
        },
        h(
          Section,
          { style: { background: "#0a0a0d", borderBottom: "3px solid #1e90ff", padding: "20px 24px" } },
          h(
            Row,
            null,
            h(Column, { style: { verticalAlign: "middle", width: 44 } }, h(Img, { src: LOGO_URL, width: 32, height: 32, alt: "Kno U Kno", style: { display: "block", borderRadius: 8 } })),
            h(
              Column,
              { style: { verticalAlign: "middle" } },
              h(
                Text,
                { style: { margin: 0, fontSize: 20, fontWeight: 800 } },
                h("span", { style: { color: "#ffffff" } }, "Kno U"),
                " ",
                h("span", { style: { color: "#1e90ff" } }, "Kno"),
              ),
            ),
          ),
        ),
        h(Section, { style: { padding: "28px 24px", color: "#111111", fontSize: 15, lineHeight: 1.6 } }, children),
      ),
    ),
  );
}
