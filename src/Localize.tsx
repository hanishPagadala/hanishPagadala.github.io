import { Children, cloneElement, isValidElement, Fragment } from 'react'
import type { ReactNode, ReactElement } from 'react'
import { usePreferences } from './preferences-context'
import { translate } from './translations'

export default function Localize({ children }: { children: ReactNode }) {
  const { preferences } = usePreferences()
  const french = preferences.language === 'fr'
  function walk(nodes: ReactNode): ReactNode {
    return Children.map(nodes, node => {
      if (typeof node === 'string') return french ? translate(node) : node
      if (!isValidElement(node)) return node
      // Each component localizes its own output; never invoke components outside React.
      if (node.type === Fragment) return cloneElement(node as ReactElement<{ children?: ReactNode }>, {}, walk((node.props as { children?: ReactNode }).children))
      if (typeof node.type !== 'string') return node
      const element = node as ReactElement<Record<string, unknown>>
      const changes: Record<string, unknown> = {}
      for (const key of ['aria-label', 'title', 'alt', 'placeholder']) if (french && typeof element.props[key] === 'string') changes[key] = translate(element.props[key] as string)
      if (french && element.props.href === './resume.html') changes.href = './resume-fr.html'
      const content = walk(element.props.children as ReactNode)
      if (node.type === 'a' && element.props.target === '_blank') {
        return cloneElement(element, changes, content, <span className="sr-only">{french ? ' (s’ouvre dans un nouvel onglet)' : ' (opens in a new tab)'}</span>)
      }
      return cloneElement(element, changes, content)
    })
  }
  return <>{walk(children)}</>
}
