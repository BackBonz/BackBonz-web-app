/**
 * Centralized Framer Motion variants.
 * All variant factories accept a `reduce` boolean from useReducedMotion().
 *
 * Usage:
 *   const reduce = useReducedMotion()
 *   <motion.div variants={fadeUp(reduce)} initial="hidden" whileInView="visible" />
 */

export function fadeUp(reduce = false) {
  return reduce
    ? { hidden: { opacity: 0 },        visible: { opacity: 1, transition: { duration: 0.2 } } }
    : { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }
}

export function fadeIn(reduce = false) {
  return {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: reduce ? 0.1 : 0.4 } },
  }
}

export function cardReveal(reduce = false) {
  return reduce
    ? { hidden: { opacity: 0 },                      visible: { opacity: 1,                   transition: { duration: 0.2 } } }
    : { hidden: { opacity: 0, scale: 0.95, y: 18 },  visible: { opacity: 1, scale: 1, y: 0,   transition: { duration: 0.45, ease: 'easeOut' } } }
}

export function staggerContainer(reduce = false) {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.1 } },
  }
}

export const springTransition = { type: 'spring', stiffness: 380, damping: 28 }
