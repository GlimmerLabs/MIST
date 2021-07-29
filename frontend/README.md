# Setup

Use [setup.sh](../setup.sh) in the parent folder.

# Set up manually

1. Run `npm install`
2. Remove the eslint folder to avoid error (needed for now)

```
rm -rf node_modules/eslint
```

3. Download the twgl.js file

```
curl -sL https://raw.githubusercontent.com/greggman/twgl.js/4f6b81a3a8a73fbda701b68536703a4c04a9b192/dist/4.x/twgl.min.js --output ./frontend/public/twgl.min.js
```

4. Run `npm run start`

# Building

Builds the app for production in the ./build folder.

```
npm run build
```
