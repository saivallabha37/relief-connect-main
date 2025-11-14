import { useEffect } from 'react'

// Hook: automatically adds 'reveal-visible' to elements with class 'reveal' when they enter the viewport
export default function useRevealOnScroll(rootMargin = '0px 0px -8% 0px') {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible')
        }
      })
    }, { threshold: 0.08, rootMargin })

    const nodes = document.querySelectorAll('.reveal')
    nodes.forEach(n => observer.observe(n))

    return () => {
      nodes.forEach(n => observer.unobserve(n))
      observer.disconnect()
    }
  }, [rootMargin])
}
