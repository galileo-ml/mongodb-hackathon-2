#!/usr/bin/env python3
"""Test vision model with Fireworks SDK"""
from fireworks.client import Fireworks

# Simple 1x1 red pixel PNG
test_image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=='

print('Testing vision model with Fireworks SDK...')

client = Fireworks(api_key='fw_WcFkQNNQGpSNvKanSgktWT')

try:
    response = client.chat.completions.create(
        model='accounts/fireworks/models/qwen2p5-vl-32b-instruct',
        messages=[{
            'role': 'user',
            'content': [
                {'type': 'text', 'text': 'What do you see in this image? Be very brief.'},
                {
                    'type': 'image_url',
                    'image_url': {'url': f'data:image/png;base64,{test_image}'}
                }
            ]
        }],
        max_tokens=50
    )
    print('✓ Vision model works!')
    print(f'Response: {response.choices[0].message.content}')
except Exception as e:
    print(f'✗ Failed: {e}')
