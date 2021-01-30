# ImageFinder

A server that could help you to find more interesting image repositories. Also, it's an easy way to have a gallery of your image repository.

Support look images hosted in `Github.com` and `Gitee.com`.

## Description 

On the front-end,

- `views/index.html` hold the content of the webpage
- `public/client.js` is the javascript that runs when you load the webpage
- `public/style.css` is the styles for `views/index.html`

On the back-end,

- *ImageFinder* starts at `server.js`
- involved packages see `package.json`

## Usage

Take one look then you can get all the points, easy!

**Demo page:** [**https://xvido.es**](https://xvido.es) 

Supported query rules:

- `Picture url:` https://cdn.jsdelivr.net/gh/name/repo/x.jpg
- `Original link from repo:` https://github.com/name/repo
- `Internal directory:` https://github.com/name/repo/tree/main/sub
- `Default branch:` https://github.com/name/repo/sub
- `Default prefix:` /name/repo/sub (Github image bed only)
- `Single page rendering:` directly visit [xvido.es](https://xvido.es)?x=url
- `Other image beds:` Gitee has been supported, the rules are the same as above

## Logs

- `v0.1` Complete basic analysis logic and basic front-end style 
- `v0.2` Add the function of rendering a separate page, which can be used as a photo album 
- `v0.3` Introduce sqlite, add recently viewed 
- `v0.4` Completion of multiple query methods, especially only the image url method 
- `v0.5` Add the function of sub-directory view, support upper and lower view operations 
- `v0.6` Improve front-end operation steps 
- `v0.7` Add the judgment that the operation returns an exception 
- `v0.8` Add support for Gitee repo, the rules are the same as Github repo


**Find out more [about Me / cz5h.com](https://www.cz5h.com).**

**( ᵔ ᴥ ᵔ )**