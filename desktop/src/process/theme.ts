import * as fs from 'fs'
import * as AdmZip from 'adm-zip'
import { codesPath, themeCodesPath } from "../utils"
import * as path from "path"
import { spawn } from 'child_process'

export async function downloadThemeCodes() {
  const buf = await fetch('https://gitee.com/iconLake/Theme/repository/archive/master.zip').then(res => res.arrayBuffer())
  const admZip = new AdmZip(Buffer.from(buf))
  admZip.extractAllTo(codesPath, true)
  fs.renameSync(path.join(codesPath, 'Theme-master'), themeCodesPath)
}

export async function checkThemeCodes() {
  if (!fs.existsSync(themeCodesPath)) {
    fs.mkdirSync(themeCodesPath, { recursive: true })
  }

  const files = fs.readdirSync(themeCodesPath)
  if (files.length === 0) {
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
  const p = spawn('npm', ['install'], {
    detached: true,
    stdio: 'inherit',
    cwd: themeCodesPath,
    env: process.env
  })
  await new Promise((resolve, reject) => {
    p.on('close', resolve)
    p.on('error', reject)
  })
}

export async function buildTheme({ code, page }: { code: string, page: 'exhibition'|'nft'|'creator' }) {
  await checkThemeCodes()
  await installDeps()
  const p = spawn('npm', ['run', 'build'], {
    detached: true,
    stdio: 'inherit',
    cwd: themeCodesPath,
    env: process.env
  })
  await new Promise((resolve, reject) => {
    p.on('close', resolve)
    p.on('error', reject)
  })
}
