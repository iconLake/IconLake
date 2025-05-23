export interface InternalMessage {
  type: string
  data: any
  id: string
}

export const requestMessagePrefix = 'iconlakeRequest:'
export const responseMessagePrefix = 'iconlakeResponse:'

export function getMessageType(type: string) {
  return type.split(':')[1]
}

export async function dealMessage(m: InternalMessage): Promise<InternalMessage> {
  return {
    type: `${responseMessagePrefix}${getMessageType(m.type)}`,
    data: 'test',
    id: m.id
  }
}
