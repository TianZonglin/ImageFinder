# ImageFinder

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

**Demo page: [https://xvido.es](https://xvido.es)**

**Gallery mode: [https://xvido.es?x=/zonelyn/bed](https://xvido.es?x=/zonelyn/bed)**

Supported query rules:

- Picture url: `https://cdn.jsdelivr.net/gh/name/repo/x.jpg`
- Original link from repo: `https://github.com/name/repo`
- Internal directory: `https://github.com/name/repo/tree/main/sub`
- Default branch: `https://github.com/name/repo/sub`
- Default prefix: `/name/repo/sub` (Github image bed only)
- Single page rendering: directly visit `xvido.es?x=url`
- Other image beds: `Gitee` has been supported, the rules are the same as above

## Logs

- `v0.1` Complete basic resolve logic and basic front-end style
- `v0.2` Add the function of rendering a separate page, which can be used as a photo album
- `v0.3` Introduce sqlite, add recently viewed
- `v0.4` Completion of multiple query methods, especially only the image url method
- `v0.5` Add the function of sub-directory view, support upper and lower view operations
- `v0.6` Improve front-end operation steps
- `v0.7` Add the judgment that the operation returns an exception
- `v0.8` Add support for Gitee repo, the rules are the same as Github repo (Stable version)

**Todo**

- `Bug:` <s>Links containing Chinese will cause errors.</s>
- `Add:` <s>Add support for Gitee image bed!</s>
- `Fix:` Use more suitable images layout (e.g. waterfall flow)

## View

![](https://cdn.jsdelivr.net/gh/TianZonglin/tuchuang/img/rfgherdf34234分3.png)

**Note:** This may invade the privacy of others, I am NOT responsible for any consequences of misusing this project.

---

**Find out more [about Me / cz5h.com](https://www.cz5h.com).**
