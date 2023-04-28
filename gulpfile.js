const { src, watch, dest, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const spritesmith = require('gulp.spritesmith');
const merge =   require('merge-stream');

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/',
    },
    port: 3000,
  })
}

function cleanDist() {
  return del('dist');
}

function images() {
  return src('app/images/*.*')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
        })
      ])
    )
    .pipe(dest('dist/imag'))
}

function scripts() {
  return (
    src([
      // подключаем jQuery
      'node_modules/jquery/dist/jquery.js',
      // подключаем slick-slaider
      'node_modules/slick-carousel/slick/slick.js',
      'app/js/main.js',
    ])
      // объединяем в единный файл
      .pipe(concat('main.min.js'))
      // минифицируем файл
      .pipe(uglify())
      // выкидываем в папку js
      .pipe(dest('app/js'))
      // обновляем страницу
      .pipe(browserSync.stream())
  )
}
// Эта функция будет конвертировать стили  из препроцессора scss в css
function styles() {
  return (
    src('app/scss/style.scss')
      .pipe(scss({ outputStyle: 'compressed' })) //делает  минифицированный
      .pipe(concat('style.min.css'))
      .pipe(
        autoprefixer({
          overrideBrowserslist: ['last 10 version'],
          grid: true,
        }),
      )
      .pipe(dest('app/css'))
      // чтоб страница обновлялась(но нужно чтобы было слежение за тремя типами файлов: HTML,CSS,JS)
      .pipe(browserSync.stream())
  )
}
// Build проекта
function build() {
  // собираем
  return (
    src(
      [
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html',
      ],
      { base: 'app' },
    ) //указываем какая базовая директория(чтобы кидало не одни файлы, а и папки где они находятся) - по новому синтаксису
      // выгружаем
      .pipe(dest('dist'))
  )
}
// Функция для SPRITES
function generateSprite() {
  const spriteData = src('app/sprite/**/*.*')
    .pipe(spritesmith({
      imgName: 'sprite.png',//на выходе как будет называться картинка в которой будут лежать все спрайты
      imgPath: '../images/sprite.png',//путь который будет прописан в генерированных стилях - как адрес картинки
      cssName: '_sprite.scss',//генерируем стили в scss
      padding: 5
    }));
  // берём картинку из spriteData и ложим её
  const imgStream = spriteData.img
    .pipe(dest('app/images'));
  // берём стили из spriteData и ложим их
  const cssStream = spriteData.css
    .pipe(dest('app/scss/mixins'));
  
  return merge(imgStream, cssStream);
}
// функция для инициализации fontAwesome
function fontsFontAwesome() {
  return (
    src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
      .pipe(dest('app/fonts'))
  )
}//меняем в node_modules/@fortawesome/fontawesome-free/scss/variables.scss $fa-font-path           : "../webfonts" !default; на $fa-font-path           : "../fonts" !default;

// функция следит за проектом
function watching() {
  browserSync.init({
    server: {
      baseDir: 'app/',
    },
    port: 3000,
  })
  watch('app/fonts/**/*.*', fontsFontAwesome())
  watch('app/sprite/**/*.*', generateSprite())
  watch(['app/scss/**/*.scss'], styles)
  // следим
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
  watch(['app/*.html']).on('change', browserSync.reload)
  // watch(['app/images/*.*'], images)
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
// exports.build = build;
exports.images = images;
exports.cleanDist = cleanDist;
exports.generateSprite = generateSprite;
exports.fontsFontAwesome = fontsFontAwesome;

exports.build = series(cleanDist, images, build);

exports.default = parallel(generateSprite, styles, scripts, browsersync, watching);

