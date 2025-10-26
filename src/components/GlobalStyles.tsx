import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  // CSS Reset
  #app, html, body {
    display: flex;
    height: 100%;
    width: 100%;
  }

  body {
      margin: 0px;
  }

  :root {
    --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

    --gray-0: rgb(167,167,167);
    --gray-20: rgb(180,180,180);
    --gray-40: rgb(192,192,192);
    --gray-60: rgb(205,205,205);
    --gray-80: rgb(218,218,218);

    --primary: var(--purple);
  }
`;
