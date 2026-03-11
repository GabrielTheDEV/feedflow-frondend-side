import { motion } from 'framer-motion'

export function LoopSpinner({ size = 28, color = 'var(--primary)' }: { size?: number, color?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray="31 90"
        strokeLinecap="round"
      />
    </motion.svg>
  )
}
