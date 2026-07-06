import { useEffect, useRef, useState, type ReactNode } from 'react'

type Props = {
  readonly children: ReactNode
  /** Delay in ms before the reveal animation fires (for staggered groups) */
  readonly delay?: number
  /** Element tag. Defaults to a div. */
  readonly as?: 'div' | 'section' | 'article'
  readonly className?: string
}

/**
 * Wraps children in an element that fades + slides up when it scrolls into view.
 * One-shot — once revealed, the observer disconnects (no fade-out on scroll-up).
 * Respects prefers-reduced-motion via CSS in index.css.
 */
export function Reveal({ children, delay = 0, as = 'div', className }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      // No IntersectionObserver (ancient browser / non-DOM env): reveal now so
      // content is never left invisible. One-shot and intentional — deferring
      // it would flash hidden content.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true)
      return
    }
    // Defensive fallback: if the observer doesn't fire within 2s for any
    // reason (browser quirk, off-screen viewport), force-show. Better to
    // skip the animation than leave content invisible.
    const fallback = setTimeout(() => setVisible(true), 2000)
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          clearTimeout(fallback)
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    obs.observe(el)
    return () => {
      clearTimeout(fallback)
      obs.disconnect()
    }
  }, [])

  const classes = ['reveal', visible ? 'is-visible' : '', className]
    .filter(Boolean)
    .join(' ')
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined

  if (as === 'section') {
    return (
      <section ref={ref as React.RefObject<HTMLElement>} className={classes} style={style}>
        {children}
      </section>
    )
  }
  if (as === 'article') {
    return (
      <article ref={ref as React.RefObject<HTMLElement>} className={classes} style={style}>
        {children}
      </article>
    )
  }
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={classes} style={style}>
      {children}
    </div>
  )
}
