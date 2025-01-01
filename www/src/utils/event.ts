const EVENT_PREFIX = 'iconlake:'

enum EventType {
  ProjectInfoChange = 'project_info_change',
  IconCollected = 'icon_collected',
}

interface EventData {
  [EventType.ProjectInfoChange]: {
    id: string
  }
  [EventType.IconCollected]: {
    id: string
  }
}

type EventListener = (data: EventData[EventType]) => void
type EventListenerCall = (e: MessageEvent) => void

class IconlakeEvent {
  private registedEvents: Record<EventType, number> = {
    [EventType.ProjectInfoChange]: 0,
    [EventType.IconCollected]: 0
  }
  private listenerMap = new Map<EventListener, EventListenerCall>()
  public EventType = EventType
  on (key: EventType, listener: EventListener) {
    this.registedEvents[key]++
    const callListener = (e: MessageEvent) => {
      if (e.data.type === `${EVENT_PREFIX}${key}`) {
        listener(e.data.data)
      }
    }
    this.listenerMap.set(listener, callListener)
    window.addEventListener('message', callListener)
  }
  off (key: EventType, listener: EventListener) {
    this.registedEvents[key]--
    const callListener = this.listenerMap.get(listener)
    if (!callListener) return
    window.removeEventListener('message', callListener)
  }
  emit (key: EventType, data: EventData[EventType]) {
    window.postMessage({
      type: `${EVENT_PREFIX}${key}`,
      data
    }, '*')
  }
  checkHealth () {
    for (const key in this.registedEvents) {
      const count = this.registedEvents[key as EventType]
      if (count < 0 || count > 10) {
        return false
      }
    }
    return true
  }
}

export const event = new IconlakeEvent()

if (import.meta.env.DEV) {
  (window as any).iconlakeEvent = event
  setInterval(() => {
    if (!event.checkHealth()) {
      console.warn('iconlake event is not healthy')
    }
  }, 1000)
}
