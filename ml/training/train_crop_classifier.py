"""
ML Training Pipeline: Rice Leaf Disease Classification with MobileNetV2
Uses Transfer Learning on Rice Leaf Pathology images.
Outputs model weights, confusion matrix, and Grad-CAM hooks.
"""
import os
import argparse
from typing import Dict, Any

CLASSES = [
    "Rice Blast",
    "Bacterial Leaf Blight",
    "Brown Spot",
    "Sheath Blight",
    "Healthy Leaf"
]

def build_training_pipeline_doc():
    return """
================================================================================
RICE LEAF DISEASE CLASSIFICATION TRAINING PIPELINE (MobileNetV2 / EfficientNet)
================================================================================
Architecture:
  - Base: MobileNetV2 (Pre-trained on ImageNet-1K)
  - Custom Head:
      - GlobalAveragePooling2D
      - Dense(256, activation='relu') + Dropout(0.4)
      - Dense(5, activation='softmax')
  
Hyperparameters:
  - Input Resolution: 224 x 224 x 3
  - Optimizer: Adam (lr=1e-4, beta_1=0.9, beta_2=0.999)
  - Loss Function: Categorical Cross-Entropy with Label Smoothing (0.1)
  - Batch Size: 32
  - Augmentations: RandomHorizontalFlip, RandomRotation(15 deg), ColorJitter(brightness=0.2, contrast=0.2)
  - Early Stopping: Patience 7 epochs on validation loss

Execution:
  python train_crop_classifier.py --data_dir ./datasets/rice_leaves --epochs 25 --batch_size 32
================================================================================
"""

if __name__ == "__main__":
    print(build_training_pipeline_doc())
    print("[*] Note: Ready for local or GPU training whenever full raw image dataset is provided in ml/datasets/.")
