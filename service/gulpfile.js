import fs from 'fs'
import gulp from 'gulp'
import SASS from 'sass'
import gulpSASS from 'gulp-sass'
import cssmin from 'gulp-clean-css'
import typescript from 'gulp-typescript'
import uglify from 'gulp-uglify'
import jsonMinify from 'gulp-json-minify'
import htmlmin from 'gulp-htmlmin'
import replace from 'gulp-replace'
import rename from 'gulp-rename'
import { marked } from 'marked'
import through2 from 'through2'

const sass = gulpSASS(SASS)

const i18n = {
  zh: JSON.parse(fs.readFileSync('../www/src/i18n/messages/zh-cn.json')),
  en: JSON.parse(fs.readFileSync('../www/src/i18n/messages/en-us.json'))
}

const desktopPackage = JSON.parse(fs.readFileSync('../desktop/package.json'))
i18n.zh.desktopVersion = desktopPackage.version
i18n.en.desktopVersion = desktopPackage.version

const tsconfig = JSON.parse(fs.readFileSync('./tsconfig.json'))

const srcPath = './assets/'
const destPath = './public/'
const scssFiles = `${srcPath}**/*.scss`
const tsFiles = `${srcPath}**/*.ts`
const jsonFiles = `${srcPath}**/*.json`
const i18nHtmlFiles = [`${srcPath}**/*.html`, `!${srcPath}exhibition/*.html`, `!${srcPath}**/*.zh-cn.html`, `!${srcPath}**/*.en-us.html`]
const htmlFiles = [`${srcPath}exhibition/*.html`, `${srcPath}**/*.zh-cn.html`, `${srcPath}**/*.en-us.html`]
const mdFiles = `${srcPath}**/*.md`

let isChanged = false
const srcOptions = {
  since: () => isChanged ? Date.now() - 3000 : 0
}

function change (cb) {
  isChanged = true
  cb()
}

export function css () {
  return gulp.src(scssFiles, srcOptions)
    .pipe(sass().on('error', sass.logError))
    .pipe(cssmin())
    .pipe(gulp.dest(destPath))
}

export function js () {
  return gulp.src(tsFiles, srcOptions)
    .pipe(typescript({
      ...tsconfig.compilerOptions,
      moduleResolution: 'node'
    }))
    .pipe(uglify())
    .pipe(gulp.dest(destPath))
}

export function json () {
  return gulp.src(jsonFiles, srcOptions)
    .pipe(jsonMinify())
    .pipe(gulp.dest(destPath))
}

function htmlZh () {
  return gulp.src(i18nHtmlFiles, srcOptions)
    .pipe(replace(/\$\{(.+?)\}/g, (match, param) => {
      return i18n.zh[param]
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename({
      extname: '.zh-cn.html'
    }))
    .pipe(gulp.dest(destPath))
}

function htmlEn () {
  return gulp.src(i18nHtmlFiles, srcOptions)
    .pipe(replace(/\$\{(.+?)\}/g, (match, param) => {
      return i18n.en[param]
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename({
      extname: '.en-us.html'
    }))
    .pipe(gulp.dest(destPath))
}

const i18nHtml = gulp.series(
  markdown,
  gulp.parallel(htmlZh, htmlEn)
)

function html () {
  return gulp.src(htmlFiles, {
    ...srcOptions,
    base: srcPath
  })
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(destPath))
}

function markdown () {
  return gulp.src(mdFiles, srcOptions)
    .pipe(through2.obj((file, encoding, cb) => {
      const name = `${file.basename.replace(/.md$/i, '')}MD`
      const content = marked.parse(file.contents.toString(encoding))
      i18n.zh[name] = content
      i18n.en[name] = content
      cb(null, file)
    }))
}

function watch (cb) {
  gulp.watch(scssFiles, gulp.series(change, css))
  gulp.watch(tsFiles, gulp.series(change, js))
  gulp.watch(jsonFiles, gulp.series(change, json))
  gulp.watch(i18nHtmlFiles, gulp.series(change, i18nHtml))
  gulp.watch(htmlFiles, gulp.series(change, html))
  gulp.watch(mdFiles, gulp.series(change, markdown))
  cb()
}

export const build = gulp.parallel(css, js, json, i18nHtml, html)

export default gulp.series(build, watch)
