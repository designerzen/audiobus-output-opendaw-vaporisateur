# audiobus-output-opendaw-vaporisateur

[openDAW](https://opendaw.studio)'s Vaporisateur, a polyphonic subtractive synthesiser, packaged
for [audiobus](https://github.com/designerzen/audiobus). It has no dependency on audiobus, so it
can also be used on its own.

## Install

```bash
pnpm add github:designerzen/audiobus-output-opendaw-vaporisateur
```

## Requirements

- A cross-origin isolated page (`SharedArrayBuffer`). audiobus's `crossOriginIsolationPlugin()`
  sets this up in Vite.
- openDAW's audio processor served at `<base>opendaw/processors.js`, or another URL passed as
  `processorsUrl`. With Vite, add the plugin:

```js
import { opendawFilesPlugin } from "audiobus-output-opendaw-vaporisateur/vite"

export default { plugins: [opendawFilesPlugin()] }
```

## Use with audiobus

```ts
import { registerInstrument } from "audiobus/instruments/instrument-types"
import { vaporisateurInstrument } from "audiobus-output-opendaw-vaporisateur"

registerInstrument(vaporisateurInstrument)
```

or as an output, with `registerOutput(vaporisateurOutput)` from `audiobus/io/output-factory`.

## Use on its own

```ts
import { createVaporisateur } from "audiobus-output-opendaw-vaporisateur"

const context = new AudioContext()
const synth = await createVaporisateur(context, { oscillator: { type: "square" } })
synth.output.connect(context.destination)
synth.noteOn(60, 100)
```

Options: `gain`, `attack`, `decay`, `sustain`, `release`, `filterCutOff`, `filterResonance`,
`slideDuration`, `fadeDuration`, `oscillator.type` and `processorsUrl`.
