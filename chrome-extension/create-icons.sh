#!/bin/bash

# Create simple icon files (you can replace these with proper icons later)
echo "Creating extension icons..."

# Create a simple SVG that can be converted to PNG
cat > /tmp/icon.svg << 'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="20" fill="#667eea"/>
  <text x="64" y="90" font-size="80" text-anchor="middle" fill="white">🎓</text>
</svg>
SVG

echo "Icons created successfully!"
echo "Note: Using placeholder emoji icons. Replace with proper PNG icons for production."
