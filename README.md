# viandwi24.com

Personal site of Alfian Dwi Nugraha: a little voxel house in a Japanese street, built with Svelte 5, Three.js and TypeScript.

Knock on the door to go in. Each room is a page: the living room (about me), a workshop of project cartridges, the garden, an experience study and a post room for contact.

## Develop

Uses [Bun](https://bun.sh) as the runtime and package manager.

```sh
bun install
bun run dev      # dev server
bun run check    # type check
bun run build    # production build in dist/
```

## Where things live

- `src/lib/scenes/` – the rooms, the house shell and the town, all built from voxels in code
- `src/lib/voxel/` – the voxel grid and mesher
- `src/lib/world/` – camera, transitions and picking
- `src/lib/ui/` – the HTML overlay: markers, panels, intro
- `src/lib/content.ts` and `src/lib/data/` – profile, skills, experience and projects
