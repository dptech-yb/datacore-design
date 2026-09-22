"""Original modular design sculpture. Run with Blender --background --python this_file.

No third-party models or textures. Dimensions use a consistent 1.08-unit module.
Exports the editable scene, a self-contained GLB, and its first-frame render.
"""
from pathlib import Path
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "public" / "models"
ASSETS.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)


def linear(value):
    return value / 12.92 if value < 0.04045 else ((value + 0.055) / 1.055) ** 2.4


def material(name, hex_color, metallic=0.0, roughness=0.3):
    color = [linear(int(hex_color[i:i + 2], 16) / 255) for i in (0, 2, 4)]
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    mat.diffuse_color = (*color, 1)
    return mat


porcelain = material("Porcelain / surface", "ECF2FA", 0.08, 0.24)
cobalt = material("Cobalt / emphasis", "2254CF", 0.25, 0.22)
ice = material("Ice / secondary", "9EBFEA", 0.22, 0.28)
graphite = material("Graphite / structure", "21354F", 0.45, 0.3)
aluminum = material("Satin aluminum / joint", "A5B7D1", 0.78, 0.25)
grid_mat = material("Grid / scale", "CAD7E8", 0.1, 0.55)


def block(name, location, dimensions, mat, bevel=0.08):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new("Consistent machined edge", "BEVEL")
        mod.width = bevel
        mod.segments = 5
        bpy.ops.object.modifier_apply(modifier=mod.name)
    normal = obj.modifiers.new("Weighted surface normals", "WEIGHTED_NORMAL")
    normal.keep_sharp = True
    bpy.ops.object.modifier_apply(modifier=normal.name)
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    return obj


def pin(name, center, radius=0.065, depth=0.18):
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=radius, depth=depth, location=center)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(aluminum)
    bevel = obj.modifiers.new("Soft tip", "BEVEL")
    bevel.width = 0.015
    bevel.segments = 3
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    for p in obj.data.polygons:
        p.use_smooth = True


# A shallow drafting plinth and functional scale marks anchor the composition.
block("Foundation", (0.10, 0, 0.065), (3.75, 3.40, 0.13), porcelain, 0.055)
for i in range(-6, 7):
    x = i * 0.24 + 0.10
    length = 0.12 if i % 3 == 0 else 0.065
    block(f"Scale mark {i}", (x, -1.50, 0.133), (0.012, length, 0.006), grid_mat, 0)

# Eight identical cells; one is offset to reveal the shared construction.
for layer in range(2):
    for row in range(2):
        for column in range(2):
            x = (column - 0.5) * 1.08
            y = (row - 0.5) * 1.08
            z = 0.70 + layer * 1.08
            if layer == 1 and column == 1 and row == 0:
                x += 0.42
                y -= 0.12
                z += 0.44
                mat = cobalt
            elif layer == 0 and row == 0 and column == 0:
                mat = cobalt
            elif layer == 1 and row == 1 and column == 1:
                mat = ice
            elif layer == 0 and row == 1:
                mat = graphite
            else:
                mat = porcelain
            block(f"Module {layer}-{row}-{column}", (x, y, z), (0.98, 0.98, 0.98), mat)

# The exposed mating detail makes the offset intentional, not a floating error.
for dx in (-0.20, 0.20):
    for dy in (-0.20, 0.20):
        pin(f"Alignment pin {dx} {dy}", (0.54 + dx, -0.54 + dy, 1.25))

# Geometry-only GLB: no external textures, network decoders, lights or cameras.
mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
bpy.ops.object.select_all(action="DESELECT")
for obj in mesh_objects:
    obj.select_set(True)
bpy.ops.export_scene.gltf(
    filepath=str(ASSETS / "modular-form.glb"),
    export_format="GLB", use_selection=True, export_apply=True,
    export_animations=False, export_cameras=False, export_lights=False,
    export_extras=False,
)

scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.samples = 48
scene.cycles.use_denoising = True
scene.render.resolution_x = 1000
scene.render.resolution_y = 1000
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.film_transparent = True
scene.view_settings.view_transform = "AgX"
scene.world = bpy.data.worlds.new("Soft studio")
scene.world.use_nodes = True
scene.world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.65, 0.75, 0.95, 1)
scene.world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.35


def area(name, location, power, size, color):
    bpy.ops.object.light_add(type="AREA", location=location)
    obj = bpy.context.object
    obj.name = name
    obj.data.energy = power
    obj.data.shape = "DISK"
    obj.data.size = size
    obj.data.color = color
    obj.rotation_euler = (Vector((0, 0, 1)) - obj.location).to_track_quat("-Z", "Y").to_euler()


area("Large softbox", (0, -5, 7), 650, 5, (1, 0.96, 0.92))
area("Cool rim", (4, 3, 5), 850, 4, (0.77, 0.86, 1))
area("Fill", (-4, -1, 3), 250, 4, (0.8, 0.9, 1))
bpy.ops.object.camera_add(location=(6, -8, 6.2))
camera = bpy.context.object
camera.rotation_euler = (Vector((0.1, 0, 1.18)) - camera.location).to_track_quat("-Z", "Y").to_euler()
camera.data.type = "ORTHO"
camera.data.ortho_scale = 5.35
scene.camera = camera

# Save the complete editable source beside this generator; camera/lights stay out of GLB.
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT / "art" / "blender" / "modular-form.blend"))
scene.render.filepath = str(ASSETS / "modular-form.png")
bpy.ops.render.render(write_still=True)
print("EXPORT_COMPLETE", ASSETS)
