<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./public/img/shanshui_logo_light.png">
  <img alt="Shan Shui logo" src="./public/img/shanshui_logo_dark.png" width="200" height="200">
</picture>
<h1>{Shan, Shui}*</h1> 
</div>
<br>

Discover the beauty of an ever-evolving Chinese landscape art. This project combines the elegance of procedural generation with the power of vector graphics to create a mesmerizing, infinite-scrolling journey.

<img alt="Shan Shui example" src="./public/img/example.png" width="100%">

You can move the canvas with the left and right arrow keys or by using the buttons. In the menu section, you can find an option to download the whole or part of your art as an SVG or to share it with your friends.

## 🏗️ Tech stack

React, TypeScript and SVG. Nothing more! ✨

## ⚙️ Installation

[Check it in online](https://shan-shui.vercel.app/) or locally:

```
npm install
npm run start
```

## 📖 Documentation

[Check it in online](https://megaemce.github.io/shan_shui_docs/) or generate it locally with TypeDoc from Shan_Shui project.

```
npm run docs
```

## 📜 Versions

This is the third iteration of this app:

1. Firstly created as a [monolithic JavaScript file](https://github.com/LingDong-/shan-shui-inf) by [Lingdong Huang](https://github.com/LingDong-)
2. Then it was [rebuilt with React 17](https://github.com/RedContritio/shan_shui_inf) by [RedContritio](https://github.com/RedContritio) without changing the source code
3. I have rebuilt it using React function components, employing an object-oriented programming approach. Additionally, I have addressed several bugs and incorporated various improvements for enhanced performance and readability:

    - Dark mode was added,
    - Some of the most complex elements were simplified,
    - Whole code was rewritten and commented using JSDoc,
    - [Fastest way to work with array](https://annoyscript.vercel.app/posts/The%20fastest%20way%20to%20work%20with%20arrays/) was implemented wherever it was reasonable,
    - Invisible objects are removed from the DOM for faster rendering and lower memory consumption,
    - Designing and rendering is done via [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) and [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for parallel computation, preventing [main thread blockages](https://web.dev/articles/optimize-long-tasks?utm_source=devtools).
      <br>
      <br>

    | | [DCL](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event) | [FCP](https://web.dev/articles/fcp) | [LCP](https://web.dev/articles/lcp) | Longest task |
    | --- | :-: | :-: | :-: | :-: |
    | Old  | 4.92s | 4.92s | 6.18s | 2.02s |
    | New  |  0.19s | 0.25s | 0.25s | 0.23s |
    | Diff | ⏬25x | ⏬19x | ⏬25x | ⏬8x |

## 🐛 Known bugs

* When the page is reloaded using `Reload` button and then the link is shared the page render different picture than original. 