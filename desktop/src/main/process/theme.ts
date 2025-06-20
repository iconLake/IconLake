import * as fs from 'fs'
import * as AdmZip from 'adm-zip'
import { codesPath, getEnvPath, isWin, themeCodesPath } from "../utils"
import * as path from "path"
import { spawn } from 'child_process'

export enum ThemeType {
  exhibition = 'exhibition',
  nft = 'nft',
  creator = 'creator'
}

export async function downloadThemeCodes() {
  const buf = await fetch('https://gitee.com/iconLake/Theme/repository/archive/master.zip').then(res => res.arrayBuffer())
  const admZip = new AdmZip(Buffer.from(buf))
  admZip.extractAllTo(codesPath, true)
  fs.renameSync(path.join(codesPath, 'Theme-master'), themeCodesPath)
}

export async function checkThemeCodes() {
  if (!fs.existsSync(codesPath)) {
    fs.mkdirSync(codesPath, { recursive: true })
  }
  if (!fs.existsSync(themeCodesPath)) {
    return await downloadThemeCodes()
  }

  const files = fs.readdirSync(themeCodesPath)
  if (files.length === 0 || !fs.existsSync(path.join(themeCodesPath, 'package.json'))) {
    fs.rmSync(themeCodesPath, { recursive: true, force: true })
    await downloadThemeCodes()
  } else {
    const lastestPackage = await fetch('https://gitee.com/iconLake/Theme/raw/master/package.json').then(res => res.json())
    const currentPackage = JSON.parse(fs.readFileSync(path.join(themeCodesPath, 'package.json'), 'utf-8'))
    if (lastestPackage.version !== currentPackage.version) {
      fs.rmSync(themeCodesPath, { recursive: true, force: true })
      await downloadThemeCodes()
    }
  }
}

export async function installDeps() {
  const env = {
    ...process.env,
    PATH: getEnvPath(),
  }
  const p = spawn('npm', ['install'], {
    stdio: 'ignore',
    cwd: themeCodesPath,
    env,
    windowsHide: true,
    shell: isWin(),
  })
  await new Promise((resolve, reject) => {
    p.on('close', resolve)
    p.on('error', reject)
  })
}

export async function buildTheme({ codes, type }: { codes: string, type: ThemeType }) {
  await checkThemeCodes()
  fs.writeFileSync(path.join(themeCodesPath, `src/${type}/App.vue`), codes)
  await installDeps()
  const env = {
    ...process.env,
    PATH: getEnvPath(),
  }
  const p = spawn('npm', ['run', `build:${type}`], {
    stdio: ['ignore', 'pipe', 'pipe'],
    cwd: themeCodesPath,
    env,
    windowsHide: true,
    shell: isWin(),
  })
  await new Promise((resolve, reject) => {
    let stdData = ''
    p.stdout.on('data', (data) => {
      stdData += data.toString()
    })
    p.stderr.on('data', (data) => {
      stdData += data.toString()
    })
    p.on('close', () => {
      if (stdData.includes('error during build')) {
        reject()
      } else {
        resolve(true)
      }
    })
    p.on('error', reject)
  })
}

export async function checkNodejs(): Promise<{ version: string }> {
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      PATH: getEnvPath(),
    }
    const p = spawn('node', ['-v'], {
      stdio: ['ignore', 'pipe', 'ignore'],
      env,
      windowsHide: true,
    })
    let stdData = ''
    p.stdout.on('data', (data) => {
      stdData += data.toString()
    })
    p.on('close', () => {
      const data = stdData.trim()
      if (data.startsWith('v')) {
        resolve({ version: data.slice(1) })
      } else {
        reject()
      }
    })
    p.on('error', reject)
  })
}
