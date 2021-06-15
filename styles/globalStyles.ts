import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body,
  html {
    min-width: 320px;
    min-height: 100%;
  }
  html {
    min-height: 100%;
    width: 100vw;
    overflow-x: hidden;
    margin: 0 auto;
    &.no-scroll {
      overflow: hidden;
    }
  }
  /* Set core body defaults */
  body {
    padding: 0;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    // text-rendering: optimizeSpeed;
    text-rendering: optimizeLegibility;
    // Nice to know about. Un-comment by need.
    // scroll-behavior: smooth;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
    /* Box sizing rules */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  /* Remove default padding */
  ul[class],
  ol[class] {
    padding: 0;
  }
  /* Remove default margin */
  body,
  h1,
  h2,
  h3,
  h4,
  p,
  ul[class],
  ol[class],
  li,
  figure,
  figcaption,
  blockquote,
  dl,
  dd {
    margin: 0;
  }
  /* Remove list styles on ul, ol elements with a class attribute */
  ul[class],
  ol[class] {
    list-style: none;
  }
  /* A elements that don't have a class get default styles */
  a:not([class]) {
    text-decoration-skip-ink: auto;
  }
  /* Make images easier to work with */
  /* img {
    max-width: 100%;
    display: block;
  } */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`

export { GlobalStyle }
