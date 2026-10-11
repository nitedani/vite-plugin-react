import * as React from 'react'

type Wrapper = {
  component: React.FC
  value?: any
  css?: () => React.ReactNode
}

const wrappers = new Map<string, Wrapper>()

const MEMO = Symbol.for('react.memo')
const FORWARD_REF = Symbol.for('react.forward_ref')

/**
 * Wraps a client reference module so that its component exports render `css`
 * next to them. The browser renders the same wrapper without `css`, so the
 * tree shape (and thus `useId`) matches SSR during hydration.
 */
export function withClientReferenceCss(
  id: string,
  mod: any,
  css?: () => React.ReactNode,
): any {
  return new Proxy(mod, {
    get(target, p, receiver) {
      const value = Reflect.get(target, p, receiver)
      if (!isComponentExport(p, value)) {
        return value
      }
      // drop the HMR timestamp so that React Refresh keeps state across module updates
      const key = id.replace(/[?&]t=\d+/, '') + '#' + p
      let wrapper = wrappers.get(key)
      if (!wrapper) {
        const component: React.FC = (props) =>
          React.createElement(
            React.Fragment,
            null,
            wrapper!.css?.(),
            React.createElement(wrapper!.value, props),
          )
        Object.defineProperty(component, 'name', { value: p })
        wrapper = { component }
        wrappers.set(key, wrapper)
      }
      wrapper.value = value
      wrapper.css = css
      return wrapper.component
    },
  })
}

// export name and value type only: SSR and the browser must agree, and `value.name` is minified
function isComponentExport(name: string | symbol, value: any): name is string {
  return (
    typeof name === 'string' &&
    (name === 'default' || /^[A-Z]/.test(name)) &&
    (typeof value === 'function' ||
      value?.$$typeof === MEMO ||
      value?.$$typeof === FORWARD_REF)
  )
}
