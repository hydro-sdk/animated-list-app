# animated-list-app
![Action Gif](https://github.com/hydro-sdk/animated-list-app/blob/master/media/action-gif.gif)  

This repository is a demonstration of basic Flutter transition animations with Hydro-SDK.

## Setting up
```bash
npm install
flutter pub get
```

## Running
Run `npx hydroc run` in a terminal while debugging `lib/main.dart` with the usual Flutter tools.

## Testing
The widget tests under the `test` directory expect the included Typescript code under `ota` to be built into a `.ota` package and placed in the `assets/ota` directory. Run `npx hydroc build --out-dir assets/ota --profile debug` and then `flutter test`.