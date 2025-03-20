import { UserInfo } from '@/apis/user'

const EVENT_PREFIX = 'iconlake:'

enum EventType {
  ProjectInfoChange = 'project_info_change',
  UserInfoChange = 'user_info_change',
  IconCollected = 'icon_collected',
}

interface EventData {
  [EventType.ProjectInfoChange]: {
    id: string
  }
  [EventType.IconCollected]: {
    id: string
  }
  [EventType.UserInfoChange]: {
    userInfo: UserInfo
  }
}

type EventListener<T extends EventType> = (data: EventData[T]) => void
type EventListenerCall = (e: MessageEvent) => void

class IconlakeEvent {
  private registedEvents: Record<EventType, number> = {
    [EventType.ProjectInfoChange]: 0,
    [EventType.IconCollected]: 0,
    [EventType.UserInfoChange]: 0,
  }
  private listenerMap = new Map<any, EventListenerCall>()
  public EventType = EventType
  on<K extends EventType> (key: K, listener: EventListener<K>) {
    this.registedEvents[key]++
    const callListener = (e: MessageEvent) => {
      if (e.data.type === `${EVENT_PREFIX}${key}`) {
        listener(e.data.data)
      }
    }
    this.listenerMap.set(listener, callListener)
    window.addEventListener('message', callListener)
  }
  off<K extends EventType> (key: K, listener: EventListener<K>) {
    this.registedEvents[key]--
    const callListener = this.listenerMap.get(listener)
    if (!callListener) return
    window.removeEventListener('message', callListener)
  }
  emit (key: EventType, data: EventData[EventType]) {
    window.postMessage({
      type: `${EVENT_PREFIX}${key}`,
      data: JSON.parse(JSON.stringify(data)),
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
