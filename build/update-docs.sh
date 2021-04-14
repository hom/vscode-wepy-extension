# Prepare
cd docs
rm -rf .vuepress/dist

# Build
npx vuepress build

# Publish to GitHub Pages
cd .vuepress/dist
git init
git add -A
git commit -m '[vuepress] update docs'
git push -f git@github.com:vuejs/wepy.git master:gh-pages

# Cleanup
cd ../..
rm -rf .vuepress/dist
