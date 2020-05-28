# Deps
yarn
cd server && yarn && cd ..

# Compile / Test
yarn compile

# Remove server devDependencies
cd server && yarn --prod && cd ..