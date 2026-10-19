import React from "react";
import { Text } from "@react-email/components";
import Layout from "./Layout.js";

const h = React.createElement;

export default function MilestoneEmail730({ name }) {
  return h(
    Layout,
    null,
    h(Text, null, `Hi ${name},`),
    h(
      Text,
      null,
      "Today marks exactly 730 days since you named your business on Kno U Kno, and we wanted to take a moment to say: look how far you've come. That is genuinely worth celebrating, because most ideas never make it this far, and yours did.",
    ),
    h(
      Text,
      null,
      "Think about everything packed into those 730 days. You answered the hard question about law - what entity to register as, and why - and you were right to take it seriously. You worked through location: the rent, the zoning, the foot traffic, the backup plan if the first choice fell through. You figured out hiring - what your first employee needed to cover, what you could actually pay, and what success looked like in the first thirty days. And you got clear on your people - who your customers really are, what problem brings them through the door, and what keeps them coming back.",
    ),
    h(
      Text,
      null,
      "None of that was easy, and none of it had one single right answer. But you wrote your own answers down anyway, in your own words, and you kept showing up. That is the whole idea behind Kno U Kno: the question is ours, the answer is yours, and it only matters once you actually use it. Two years later, you have - and that is something to feel genuinely good about.",
    ),
    h(
      Text,
      null,
      "Being in business for two years means you have made payroll, or paid yourself, more times than you can count. It means you got through a slow month and came out the other side. It means a customer came back a second time, then a third, because something you built actually worked for them. And it means the plan you wrote on day one is not the plan you are running today - which is exactly how it should be. A business that hasn't changed in two years isn't listening to its customers, and yours clearly is.",
    ),
    h(
      Text,
      null,
      "So take a minute today to just feel happy about it. However big or small things look right now, two years in business is a real, measurable, hard-won result - and it is yours. Go back into your business title whenever you want to see where you started, re-grade your answers, or add new ones as things keep changing. We kept every one of them for exactly this reason.",
    ),
    h(Text, null, "Congratulations on two years. Here is to the next two, and to enjoying every bit of it."),
    h(Text, null, "Know you know.", h("br"), "Kno U Kno"),
  );
}
