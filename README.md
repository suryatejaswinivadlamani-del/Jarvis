# React + Vite

## Desktop application

Install frontend dependencies with `npm install`, then run `npm run desktop:dev` to open the existing J.A.R.V.I.S interface in its Electron desktop window. Run `npm run desktop:build` to create a Windows NSIS installer in `frontend/release`.

The packaged app starts the existing Express backend locally. Store `OPENAI_API_KEY` and optional `AI_MODEL` in `%APPDATA%/jarvis-assistant/.env`; do not put secrets in frontend files. In the desktop app, closing the window hides J.A.R.V.I.S in the system tray. Choose Quit from the tray menu to stop it. Microphone and wake-word capture remain off until enabled in the Voice Assistant module, and recognition stops when the window is hidden.

The optional spoken startup greeting is controlled from System Settings. It does not activate the microphone.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
