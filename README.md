# ImageFinder

[![Author](https://img.shields.io/badge/Author-TianZonglin-green?style=plastic&logo=appveyor)](https://github.com/TianZonglin)
![GitHub package.json version](https://img.shields.io/github/package-json/v/TianZonglin/ImageFinder?style=plastic)
![Uptime Robot ratio (7 days)](https://img.shields.io/uptimerobot/ratio/7/m787087225-950e39e5cd6e3d6c5c9be0cb?style=plastic)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/TianZonglin/ImageFinder?style=plastic)
![GitHub last commit](https://img.shields.io/github/last-commit/TianZonglin/ImageFinder?style=plastic)

![](https://cdn.jsdelivr.net/gh/TianZonglin/tuchuang/img/20210131041449.png)

A server that could help you to find more interesting image repositories. Also, it could be an easy way to make a gallery for your image repository. Support users to look images hosted in `Github.com` and `Gitee.com`. You can redeploy this server to build your own service or just USE the demo website directly.

To redeploy, you need to have a `nodejs` environment at first, then make sure you install all packages in `package.json`. Since I used `sqlite` to store some data, you need to manually execute some codes as follows to create a proper table with your sqlite.

```sql
CREATE TABLE CList (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT, hot TEXT, size TEXT, ctime TEXT, ex1 TEXT, ex2 TEXT, ex3 TEXT, ex4 TEXT
 )
```

Next, things will be very easy: just run & look. Have fun!
(Don't know how to run a node app? see [document](https://nodejs.org/docs/latest-v13.x/api/synopsis.html))

## Description

On the front-end,

- `views/index.html` hold the content of the webpage
- `public/client.js` is the javascript that runs when you load the webpage
- `public/style.css` is the styles for `views/index.html`

On the back-end,

- _ImageFinder_ starts at `server.js`
- involved packages see `package.json`

## Usage

Take one look then you can get all the points, easy!

**Demo page: [https://aim.photos](https://aim.photos)**

**Gallery mode: [https://aim.photos?x=/zonelyn/bed](https://aim.photos?x=/zonelyn/bed)**

Supported query rules:

- Picture url: `https://cdn.jsdelivr.net/gh/name/repo/x.jpg`
- Original link from repo: `https://github.com/name/repo`
- Internal directory: `https://github.com/name/repo/tree/main/sub`
- Default branch: `https://github.com/name/repo/sub`
- Default prefix: `/name/repo/sub` (Github image bed only)
- Single page rendering: directly visit `xvido.es?x=url`
- Other image beds: `Gitee` has been supported, the rules are the same as above

## Logs

- `v0.0.1` Complete basic resolve logic and basic front-end style
- `v0.0.2` Add the function of rendering a single page, which can be used as a photo album
- `v0.0.3` Introduce `sqlite3`, add the module of `recent view`
- `v0.0.4` Completion of multiple query methods, especially only the image url method
- `v0.0.5` Add the function of `sub-directory` view, support upper and lower view operations
- `v0.0.6` Improve front-end operation steps
- `v0.0.7` Add the judgment that the operation returns an exception
- `v0.0.8` Add support for Gitee repo, the rules are the same as Github repo (Stable version)
- `v0.0.9` Create slider tool (`nstSlider.js`) to change the size of pictures smoothly.
- `v0.1.0` Kill the blank space by new layout.

**Todo**

- `Bug:` <s>Links containing Chinese will cause errors.</s>
- `Add:` <s>Add support for Gitee image bed!</s>
- `Fix:` Use more suitable images layout (e.g. waterfall flow)

## View

![](https://i.loli.net/2021/01/31/6ziBduAOTIsRbDe.png)



**Note:** This may invade the privacy of others, I am NOT responsible for any consequences of misusing this project.

---

**Find out more. [程序萌 / cxmoe.com](https://www.cxmoe.com).**
