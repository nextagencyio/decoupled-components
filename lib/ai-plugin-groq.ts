'use client'
import { createAiChatPlugin } from 'puck-plugin-ai'

export const aiPlugin = createAiChatPlugin({ endpoint: '/api/ai/generate' })
