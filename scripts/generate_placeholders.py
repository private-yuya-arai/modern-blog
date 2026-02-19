import matplotlib.pyplot as plt
import numpy as np
import os

# List of missing images (filename -> title/text)
# We will use the filename as the text label
images_to_generate = [
    ("probability.png", "Probability"),
    ("modeling.png", "Statistical Modeling"),
    ("glm.png", "GLM"),
    ("nonparametric.png", "Nonparametric Tests"),
    ("bayesian.png", "Bayesian Statistics"),
    ("doe.png", "Experimental Design"),
    ("timeseries-advanced.png", "Advanced Time Series"),
    ("markov.png", "Stochastic Processes"),
    ("sampling.png", "Sampling Theory"),
    ("qc.png", "Quality Control"),
    ("entropy.png", "Information Entropy"),
    ("distributions.png", "Distributions"),
    ("data-analysis.png", "Applied Statistics"),
    ("high-dim.png", "High-Dimensional Data"),
    ("sparse.png", "Sparse Modeling"),
    ("mixture.png", "Mixture Models"),
    ("missing-data.png", "Missing Data"),
    ("robust.png", "Robust Statistics"),
    ("causal.png", "Causal Inference"),
    ("hierarchical.png", "Hierarchical Bayes"),
    ("bootstrap.png", "Bootstrap Resampling"),
    ("validation.png", "Model Diagnosis"),
    ("limit-theorems.png", "Sampling Distributions"),
    ("ethics.png", "Ethics & Reproducibility"),
    ("estimation.png", "Estimation"),
    ("hypothesis.png", "Hypothesis Testing"),
    ("anova.png", "ANOVA"),
    ("regression.png", "Regression Analysis"),
    ("multivariate.png", "Multivariate Analysis"),
    ("timeseries.png", "Time Series Basics")
]

output_dir = "public/images"
os.makedirs(output_dir, exist_ok=True)

# Function to generate a stylish abstract placeholder
def generate_image(filename, text):
    plt.figure(figsize=(12, 6.3)) # ~1200x630px for OG images / 1.91:1 ratio
    
    # Random abstract background
    plt.xlim(0, 100)
    plt.ylim(0, 50)
    plt.axis('off')
    
    # Soft background color
    bg_color = np.random.choice(['#f8f9fa', '#e9ecef', '#dee2e6', '#dae0e5'])
    plt.gca().set_facecolor(bg_color)
    plt.fill_between([0, 100], 0, 50, color=bg_color)

    # Random geometric shapes
    for _ in range(5):
        shape_type = np.random.choice(['circle', 'rect'])
        color = np.random.choice(['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'])
        alpha = np.random.uniform(0.1, 0.3)
        
        if shape_type == 'circle':
            circle = plt.Circle((np.random.uniform(10, 90), np.random.uniform(10, 40)), 
                                np.random.uniform(5, 15), color=color, alpha=alpha)
            plt.gca().add_patch(circle)
        else:
            rect = plt.Rectangle((np.random.uniform(0, 90), np.random.uniform(0, 40)),
                                 np.random.uniform(10, 30), np.random.uniform(5, 20),
                                 color=color, alpha=alpha, angle=np.random.uniform(-15, 15))
            plt.gca().add_patch(rect)

    # Add text
    plt.text(50, 25, text, fontsize=30, ha='center', va='center', 
             fontname='sans-serif', fontweight='bold', color='#333333')

    # Save
    filepath = os.path.join(output_dir, filename)
    plt.savefig(filepath, bbox_inches='tight', pad_inches=0, dpi=100)
    plt.close()
    print(f"Generated {filepath}")

if __name__ == "__main__":
    for filename, text in images_to_generate:
        generate_image(filename, text)
