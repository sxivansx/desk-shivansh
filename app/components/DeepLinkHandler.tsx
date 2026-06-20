'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

interface DeepLinkHandlerProps {
  /** Only act once the desktop has booted and windows can render. */
  ready: boolean
  /** Window ids that are allowed to be opened via the URL. */
  validIds: string[]
  onOpen: (id: string) => void
}

/**
 * Reads `?open=<windowId>` on load and opens the matching window once.
 * Must be rendered inside a <Suspense> boundary because it uses
 * useSearchParams (Next statically prerenders the `/` shell).
 */
export default function DeepLinkHandler({ ready, validIds, onOpen }: DeepLinkHandlerProps) {
  const params = useSearchParams()
  const handled = useRef(false)

  useEffect(() => {
    if (!ready || handled.current) return
    const target = params.get('open')
    if (target && validIds.includes(target)) {
      handled.current = true
      onOpen(target)
    }
  }, [ready, params, validIds, onOpen])

  return null
}
