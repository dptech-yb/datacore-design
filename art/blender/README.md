# DataCore modular form

This folder contains the editable Blender source for the homepage visual study.
It is intentionally geometry-only: no production data, private URLs, or product state is encoded in the model.

## Regenerate the assets

From the repository root, with Blender 5.x or newer:

```bash
blender --background --python art/blender/modular_form.py
```

The script writes the editable scene to `art/blender/modular-form.blend`, a self-contained GLB to `public/models/modular-form.glb`, and a transparent poster render to `public/models/modular-form.png`. The web build uses the compressed `public/models/modular-form.webp` poster.

The model is an exploded 2×2×2 arrangement of rounded modules on a measured plinth. It is a visual metaphor for reusable units, not a semantic map of the platform. The site shows the poster first and loads the GLB only after the user selects the 3D action.
