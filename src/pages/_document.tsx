import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        {/* Here we will mount our modal portal */}
        <div id="modal" />
        <NextScript />
      </body>
    </Html>
  );
}
