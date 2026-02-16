// @ts-nocheck
'use client'

import Script from 'next/script'

export default function GradioLoader() {
  return (
    <Script
      src="https://gradio.s3-us-west-2.amazonaws.com/5.5.0/gradio.js"
      strategy="afterInteractive"
    />
  )
}

