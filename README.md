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

Defaults in [the instrument](opendaw-vaporisateur.ts) are gain `0.2`, attack `0.005`, decay `0.1`, sustain `0.5`, release `0.5`, filter cutoff `8000`, resonance `0.1`, slide `0`, fade `0.02` and sawtooth oscillator. Envelope/slide/fade durations use seconds and cutoff uses Hz. Output gain includes the implementation's +12 dB trim. Enable/resume the context from a user action, release notes and await `disconnect()` on removal; the host owns closing its context.

Harmoneasy registers this as an **instrument** with ID `opendaw-vaporisateur`. Use a full preset device definition with `factory: "instrument"`; the app does not register it as an output shorthand merely because the package also exports `vaporisateurOutput`. See [index.ts](index.ts), [engine setup](vaporisateur-engine.ts), [asset plugin](opendaw-files.js) and [manifest](package.json) for current exports and requirements. The separate [opendaw package](../openDAW/README.md) exports recorded notes as a script.
