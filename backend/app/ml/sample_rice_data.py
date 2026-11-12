"""
Sample Rice Disease Leaf Generator and Demo Assets
Creates realistic rice leaf imagery with pathological lesions for seed data and one-click demo testing.
"""
import os
import cv2
import numpy as np

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

def create_synthetic_leaf(
    pattern: str = "healthy",
    width: int = 400,
    height: int = 600,
    filename: str = "sample_leaf.jpg"
) -> str:
    """
    Synthesize realistic rice leaf blade with distinct pathological morphology.
    """
    # Background (soil / muted cloth background)
    img = np.full((height, width, 3), (228, 232, 226), dtype=np.uint8)

    # Leaf blade contour: long vertical blade tapering at top
    center_x = width // 2
    leaf_mask = np.zeros((height, width), dtype=np.uint8)
    
    # Points defining tapered rice leaf blade
    leaf_pts = np.array([
        [center_x, 30], # Tip
        [center_x + 65, 120],
        [center_x + 85, 300],
        [center_x + 80, 520],
        [center_x + 65, 590],
        [center_x - 65, 590],
        [center_x - 80, 520],
        [center_x - 85, 300],
        [center_x - 65, 120]
    ], np.int32)

    cv2.fillPoly(leaf_mask, [leaf_pts], 255)

    # Base green leaf texture (Chlorophyll tones in BGR: B: 30-50, G: 150-190, R: 70-100)
    for y in range(height):
        for x in range(width):
            if leaf_mask[y, x] > 0:
                # Add natural longitudinal vein gradient
                dist_from_center = abs(x - center_x)
                vein_shade = int(5 * np.sin(x * 0.8))
                base_b = int(np.clip(38 + vein_shade - dist_from_center * 0.1, 20, 60))
                base_g = int(np.clip(168 - dist_from_center * 0.4 + (y * 0.03), 120, 200))
                base_r = int(np.clip(72 - dist_from_center * 0.2, 40, 110))
                img[y, x] = [base_b, base_g, base_r]

    # Draw central midrib vein
    for y in range(35, 585):
        if leaf_mask[y, center_x] > 0:
            img[y, center_x - 1 : center_x + 2] = [48, 195, 88]

    # Overlay specific disease pathology
    if pattern == "rice_blast_early":
        # Few spindle-shaped lesions with brown borders and ash gray centers
        centers = [(center_x - 25, 240), (center_x + 30, 360), (center_x - 10, 450)]
        for cx, cy in centers:
            # Elliptical spindle
            cv2.ellipse(img, (cx, cy), (14, 38), 12, 0, 360, (25, 55, 110), -1) # Brown border
            cv2.ellipse(img, (cx, cy), (8, 24), 12, 0, 360, (140, 150, 155), -1) # Ash center
            cv2.ellipse(img, (cx, cy), (20, 52), 12, 0, 360, (40, 180, 220), 2) # Yellow halo

    elif pattern == "rice_blast_advanced":
        # Many coalescing blast lesions covering greater leaf area (longitudinal progression!)
        centers = [
            (center_x - 30, 180), (center_x - 15, 230), (center_x - 35, 270),
            (center_x + 25, 330), (center_x + 35, 380), (center_x - 10, 430),
            (center_x + 15, 480), (center_x - 20, 520)
        ]
        for cx, cy in centers:
            cv2.ellipse(img, (cx, cy), (18, 48), 15, 0, 360, (20, 48, 95), -1) # Necrotic brown
            cv2.ellipse(img, (cx, cy), (11, 32), 15, 0, 360, (135, 142, 148), -1) # Gray ash
            cv2.ellipse(img, (cx, cy), (26, 62), 15, 0, 360, (35, 175, 215), 2) # Chlorotic yellow

    elif pattern == "bacterial_leaf_blight":
        # Wavy marginal yellow-to-white drying stripes along leaf edges
        for y in range(120, 520):
            # Left wavy margin
            wavy_offset = int(12 * np.sin(y * 0.05) + 8 * np.sin(y * 0.12))
            edge_x_left = center_x - 70 + wavy_offset
            for x in range(max(0, edge_x_left - 18), edge_x_left + 14):
                if 0 <= x < width and leaf_mask[y, x] > 0:
                    # Bleached straw yellow / whitish bacterial stripe
                    img[y, x] = [80, 205, 240] if x > edge_x_left - 6 else [30, 75, 130]

    elif pattern == "brown_spot":
        # Numerous small circular/oval dark spots with yellow halo
        np.random.seed(42)
        for _ in range(22):
            rx = int(center_x + np.random.randint(-55, 55))
            ry = int(np.random.randint(120, 540))
            if leaf_mask[ry, rx] > 0:
                cv2.circle(img, (rx, ry), 9, (35, 175, 215), -1) # Yellow halo
                cv2.circle(img, (rx, ry), 5, (20, 45, 90), -1)   # Dark brown necrotic center

    # Save image
    out_path = os.path.join(UPLOAD_DIR, filename)
    cv2.imwrite(out_path, img)
    return out_path

def generate_all_sample_assets():
    """Generate all baseline sample assets."""
    create_synthetic_leaf("healthy", filename="sample_healthy_rice.jpg")
    create_synthetic_leaf("rice_blast_early", filename="sample_blast_day14.jpg")
    create_synthetic_leaf("rice_blast_advanced", filename="sample_blast_day24.jpg")
    create_synthetic_leaf("bacterial_leaf_blight", filename="sample_blb_leaf.jpg")
    create_synthetic_leaf("brown_spot", filename="sample_brown_spot.jpg")
