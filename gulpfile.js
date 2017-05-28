const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("./tsconfig.json");

gulp.task("build", () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(tsProject.options.outDir));
});

gulp.task("default", ["build"]);
