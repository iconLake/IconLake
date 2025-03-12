import Browser from "webextension-polyfill";
import { ProjectTypes } from "../types";

const settingsKey = 'settings'

export interface Settings {
  projectType: ProjectTypes
  imgMinSize: number
}

export async function getSettings() {
  const { [settingsKey]: settings } = await Browser.storage.local.get(settingsKey)
  return {
    projectType: ProjectTypes.SVG,
    imgMinSize: 100,
    ...settings,
  } as Settings
}

export async function updateSettings(options: Partial<Settings>) {
  const settings = await getSettings()
  await Browser.storage.local.set({
    [settingsKey]: {
      ...settings,
      ...options,
    }
  })
}
