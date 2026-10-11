'use client'

import './client.css'
import React from 'react'

export const TestSuspenseClientCssClient = React.memo(
  function TestSuspenseClientCssClient(props: {
    format: (id: string) => string
  }) {
    const id = React.useId()
    return (
      <div className="test-suspense-client-css" data-id={id}>
        {props.format(id)}
      </div>
    )
  },
)

export function formatSuspenseClientCss(id: string) {
  return `test-suspense-client-css: ${id}`
}
