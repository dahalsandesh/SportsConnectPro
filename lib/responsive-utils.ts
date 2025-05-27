"use client"

import { useEffect, useState } from "react"

// Breakpoint values matching Tailwind CSS
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const

type Breakpoint = keyof typeof breakpoints

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    window.addEventListener("resize", listener)
    return () => window.removeEventListener("resize", listener)
  }, [matches, query])

  return matches
}

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]}px)`)
}

export function useIsMobile(): boolean {
  return !useBreakpoint("md")
}

export function useIsTablet(): boolean {
  const isMd = useBreakpoint("md")
  const isLg = useBreakpoint("lg")
  return isMd && !isLg
}

export function useIsDesktop(): boolean {
  return useBreakpoint("lg")
}

// Screen size detection hook
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<{
    width: number
    height: number
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
  }>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  })

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setScreenSize({
        width,
        height,
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg,
      })
    }

    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [])

  return screenSize
}

// Responsive value hook
export function useResponsiveValue<T>(values: {
  base: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  "2xl"?: T
}): T {
  const [currentValue, setCurrentValue] = useState(values.base)

  useEffect(() => {
    const updateValue = () => {
      const width = window.innerWidth

      if (width >= breakpoints["2xl"] && values["2xl"] !== undefined) {
        setCurrentValue(values["2xl"])
      } else if (width >= breakpoints.xl && values.xl !== undefined) {
        setCurrentValue(values.xl)
      } else if (width >= breakpoints.lg && values.lg !== undefined) {
        setCurrentValue(values.lg)
      } else if (width >= breakpoints.md && values.md !== undefined) {
        setCurrentValue(values.md)
      } else if (width >= breakpoints.sm && values.sm !== undefined) {
        setCurrentValue(values.sm)
      } else {
        setCurrentValue(values.base)
      }
    }

    updateValue()
    window.addEventListener("resize", updateValue)
    return () => window.removeEventListener("resize", updateValue)
  }, [values])

  return currentValue
}
