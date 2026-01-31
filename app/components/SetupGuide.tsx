'use client'

import { AlertCircle, Terminal, ExternalLink } from 'lucide-react'
import Button from './ui/Button'

export default function SetupGuide() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Setup Required</h1>
            <p className="text-gray-500">Connect to Drupal to load content</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Quick Setup (Recommended)
            </h2>
            <p className="text-gray-600 mb-4">
              Run the interactive setup wizard to create a Drupal space and import sample content:
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm">
              <p className="text-gray-400"># Install dependencies and run setup</p>
              <p>npm install</p>
              <p>npm run setup</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Manual Setup</h2>
            <ol className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <span>
                  Create a Drupal space at{' '}
                  <a
                    href="https://decoupled.io"
                    className="text-primary-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Decoupled.io
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <span>Copy <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">.env.example</code> to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">.env.local</code></span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <span>Add your Drupal credentials to the environment file</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </span>
                <span>
                  Run <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">npm run setup-content</code> to import sample content
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                  5
                </span>
                <span>Restart the development server</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              href="https://decoupled.io/docs"
              className="flex-1 justify-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Documentation
            </Button>
            <Button
              variant="outline"
              href="https://github.com/nextagencyio/decoupled-dashboard"
              className="flex-1 justify-center"
            >
              View on GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
