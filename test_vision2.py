#!/usr/bin/env python3
"""Test vision model with a proper generated image"""
from fireworks.client import Fireworks
from PIL import Image
import base64
import io

# Create a simple 100x100 red square image
print('Creating test image...')
img = Image.new('RGB', (100, 100), color='red')

# Convert to base64
buffer = io.BytesIO()
img.save(buffer, format='PNG')
buffer.seek(0)
image_base64 = base64.b64encode(buffer.read()).decode('utf-8')

print(f'Image created: {len(image_base64)} bytes encoded')
print('Testing vision model...')

client = Fireworks(api_key='fw_WcFkQNNQGpSNvKanSgktWT')

try:
    response = client.chat.completions.create(
        model='accounts/fireworks/models/qwen2p5-vl-32b-instruct',
        messages=[{
            'role': 'user',
            'content': [
                {'type': 'text', 'text': 'What color is this image?'},
                {
                    'type': 'image_url',
                    'image_url': {'url': f'data:image/png;base64,{image_base64}'}
                }
            ]
        }],
        max_tokens=50
    )
    print('✓ SUCCESS! Vision model works!')
    print(f'Response: {response.choices[0].message.content}')
except Exception as e:
    print(f'✗ Failed: {e}')
