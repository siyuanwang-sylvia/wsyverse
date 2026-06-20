# THE ARCHIPELAGO — Island Creation Guide

> Every folder becomes an island. Every file makes it grow.

---

## The Four Named Islands

| Island | Folder | Realm | Theme |
|--------|--------|-------|-------|
| 🔭 Celestarium | `celestarium/` | Celestial | Deep cosmos, star charts, aurora |
| 🎵 The Sound Reef | `the-sound-reef/` | Sound | Ocean cave, instruments, sound waves |
| 🎨 Motion Garden | `motion-garden/` | Art | Dream garden, flowing creativity |
| 🏄 Playground | `playground/` | Motion | Multi-terrain, sports, expeditions |

Plus: 🌫 `unknown-island/` — always waits in the deep.

---

## How to Create an Island

1. Create a folder inside `public/passion/`
2. Add an `island.json` for identity (optional)
3. Add files into the folder
4. Refresh — your island appears on the archipelago

```
public/passion/
  my-island/
    island.json          ← Identity (optional)
    photo.jpg            ← Your content
    notes.md
    guide.pdf
```

---

## island.json Reference

```json
{
  "name": "My Island",
  "subtitle": "A poetic tagline",
  "desc": "Island description for the detail page",
  "color": "#1a2a3a",      // Base color (hex or HSL)
  "glow": "#4a7aaa",       // Glow/accent color
  "light": "#6a9aca",      // Highlight color
  "icon": "🔭",             // Display emoji
  "realm": "celestial",    // Category
  "theme": {
    "bg": "#020818",
    "accent": "#4a8aaa",
    "particleColor": "rgba(120,180,220,0.5)",
    "nebulaColor": "rgba(40,80,160,0.04)",
    "atmosphere": "deep-cosmos"   // deep-cosmos | ocean-cave | dream-garden | dynamic-terrain
  },
  "sections": [
    { "id": "photos", "name": "Photos", "nameCN": "照片", "icon": "📷" }
  ],
  "instruments": [...]    // For Sound Reef: instrument sub-areas
}
```

---

## Evolution System

Islands grow based on their content. No configuration needed.

| Files | Level | Name | Visual |
|-------|-------|------|--------|
| 0 | 0 | UNCHARTED | Hidden in fog |
| 1-5 | 1 | DISCOVERED | Small, emerging |
| 6-15 | 2 | SETTLING | Medium, structures visible |
| 16-30 | 3 | THRIVING | Large, full ecosystem |
| 31+ | 4 | CIVILIZATION | Massive, world of its own |

### Fog System

- < 3 days no update: Clear
- 3-14 days: Light fog
- 14-30 days: Medium fog
- 30+ days: Heavy fog

Adding new files clears the fog.

---

## Cosmos Language

| Common | Cosmic |
|--------|--------|
| Island | Interest |
| Realm | Category |
| Files | Relics |
| Photos | Echoes |
| Videos | Fragments |
| Notes | Field Notes |
| Audio | Signals |
| Growth | Evolution |
