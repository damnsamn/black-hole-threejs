## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production (gh-pages) in the dist/ directory
npm run build

# Commit diat folder to gh-pages branch
git subtree push --prefix dist origin gh-pages

```
