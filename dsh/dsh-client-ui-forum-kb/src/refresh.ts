// A single read batch per mounted panel. Navigation invalidates late responses;
// timer ticks never queue work, explicit actions coalesce to one subsequent read.
export function createRefreshLoop(options: {
  read: (isCurrent: () => boolean) => Promise<void>
  visible: () => boolean
  interval?: number
  onError?: (error: unknown) => void
}) {
  let generation = 0
  let disposed = false
  let running = false
  let pending = false
  async function request(force = true) {
    if (disposed || !options.visible()) return
    if (running) { if (force) pending = true; return }
    running = true
    const version = generation
    const isCurrent = () => !disposed && generation === version
    try { await options.read(isCurrent) }
    catch (error) { if (isCurrent()) options.onError?.(error) }
    finally {
      running = false
      if (pending) { pending = false; void request() }
    }
  }
  const timer = setInterval(() => void request(false), options.interval ?? 5000)
  return {
    request,
    invalidate() { generation += 1 },
    dispose() { disposed = true; generation += 1; pending = false; clearInterval(timer) },
  }
}
