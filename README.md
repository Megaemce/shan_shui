<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/public/img/shanshui_logo_dark.png">
  <img alt="Shan Shui logo" src="/public/img/shanshui_logo_light.png" width="300" height="300">
</picture>
</a>
</div>

# {Shan, Shui}\*

Discover the beauty of an ever-evolving Chinese landscape art. This project combines the elegance of procedural generation with the power of vector graphics to create a mesmerizing, infinite-scrolling journey.

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
2. Then it was [rebuilt with React 17](https://github.com/RedContritio/shan_shui_inf) by [RedContritio](https://github.com/RedContritio).
3. I have rebuilt it using React components, employing an object-oriented programming approach. Additionally, I have addressed several bugs and incorporated various improvements for enhanced performance and readability:
    - Designing and rendering is done via [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) for parallel computation and [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for the [main thread blockages reduction](https://web.dev/articles/optimize-long-tasks?utm_source=devtools),
    - Invisible objects are removed from the DOM for faster rendering,
    - Some of the most complex elements were simplified,
    - Whole code was rewritten and commented using TypeDoc,
    - [Fastest way to work with array](https://annoyscript.vercel.app/posts/The%20fastest%20way%20to%20work%20with%20arrays/) was implemented wherever it is reasonable.
