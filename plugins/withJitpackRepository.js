const { withProjectBuildGradle } = require('@expo/config-plugins');

/**
 * O NewPipe Extractor só é publicado no JitPack, então o repositório
 * https://jitpack.io precisa estar visível para o Gradle na hora de
 * resolver a dependência declarada em modules/youtube-extractor/android/build.gradle.
 *
 * Este plugin injeta o repositório no bloco "allprojects { repositories { ... } }"
 * do android/build.gradle gerado pelo `expo prebuild`.
 *
 * Se o seu projeto usa dependencyResolutionManagement (com FAIL_ON_PROJECT_REPOS) no
 * android/settings.gradle, este plugin não terá efeito e o Gradle vai reclamar de
 * "repositories declared in project build files"; nesse caso, adicione manualmente
 * `maven { url 'https://jitpack.io' }` dentro de dependencyResolutionManagement no
 * settings.gradle (não há um mod hook estável de settings.gradle no config-plugins
 * ainda, então esse ajuste manual às vezes é necessário).
 */
function injectJitpackRepo(contents) {
  if (contents.includes('jitpack.io')) {
    return contents;
  }

  const allprojectsRepositoriesRegex = /(allprojects\s*{\s*repositories\s*{)/;

  if (allprojectsRepositoriesRegex.test(contents)) {
    return contents.replace(
      allprojectsRepositoriesRegex,
      `$1\n        maven { url 'https://jitpack.io' }`
    );
  }

  // Fallback: se não encontrar o padrão esperado, acrescenta um bloco allprojects próprio.
  return `${contents}\n\nallprojects {\n    repositories {\n        maven { url 'https://jitpack.io' }\n    }\n}\n`;
}

module.exports = function withJitpackRepository(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = injectJitpackRepo(config.modResults.contents);
    } else {
      console.warn(
        '[withJitpackRepository] android/build.gradle não está em Groovy — ajuste manualmente o repositório JitPack.'
      );
    }
    return config;
  });
};
