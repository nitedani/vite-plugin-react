import React from 'react'

export function TestSuspenseClientCss(props: { url: URL }) {
  if (props.url.search.includes('test-suspense-client-css')) {
    async function Inner() {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const { TestSuspenseClientCssClient, formatSuspenseClientCss } =
        await import('./client')
      return <TestSuspenseClientCssClient format={formatSuspenseClientCss} />
    }
    return (
      <React.Suspense fallback={<div>suspense-client-css-fallback</div>}>
        <Inner />
      </React.Suspense>
    )
  }
  return <a href="?test-suspense-client-css">test-suspense-client-css</a>
}
