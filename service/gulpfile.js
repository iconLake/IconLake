import fs from 'fs'
import gulp from 'gulp'
import SASS from 'sass'
import gulpSASS from 'gulp-sass'
import sourcemap from 'gulp-sourcemaps'
import cssmin from 'gulp-clean-css'
import typescript from 'gulp-typescript'
import uglify from 'gulp-uglify'
import htmlmin from 'gulp-htmlmin'
import replace from 'gulp-replace'
import rename from 'gulp-rename'

const sass = gulpSASS(SASS)

const i18n = {
  zh: JSON.parse(fs.readFileSync('../www/src/i18n/messages/zh-cn.json')),
  en: JSON.parse(fs.readFileSync('../www/src/i18n/messages/en-us.json'))
}

const srcPath = './assets/'
const destPath = './public/'
const scssFiles = `${srcPath}**/*.scss`
const tsFiles = `${srcPath}**/*.ts`
const htmlFiles = `${srcPath}**/*.html`

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
    .pipe(sourcemap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssmin())
    .pipe(sourcemap.write('./'))
    .pipe(gulp.dest(destPath))
}

export function js () {
  return gulp.src(tsFiles, srcOptions)
    .pipe(sourcemap.init())
    .pipe(typescript())
    .pipe(uglify())
    .pipe(sourcemap.write('./'))
    .pipe(gulp.dest(destPath))
}

function htmlZh () {
  return gulp.src(htmlFiles, srcOptions)
    .pipe(replace(/\$\{(.+)\}/g, (match, param) => {
      return i18n.zh[param]
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename({
      extname: '.zh-cn.html'
    }))
    .pipe(gulp.dest(destPath))
}

function htmlEn () {
  return gulp.src(htmlFiles, srcOptions)
    .pipe(replace(/\$\{(.+)\}/g, (match, param) => {
      return i18n.en[param]
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename({
      extname: '.en-us.html'
    }))
    .pipe(gulp.dest(destPath))
}

const html = gulp.parallel(htmlZh, htmlEn)

function watch (cb) {
  gulp.watch(scssFiles, gulp.series(change, css))
  gulp.watch(tsFiles, gulp.series(change, js))
  gulp.watch(htmlFiles, gulp.series(change, html))
  cb()
}

export const init = gulp.parallel(css, js, html)

export default gulp.series(init, watch)
