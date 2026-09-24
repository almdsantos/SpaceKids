package expo.modules.youtubeextractor

import okhttp3.OkHttpClient
import okhttp3.RequestBody.Companion.toRequestBody
import org.schabi.newpipe.extractor.downloader.Downloader
import org.schabi.newpipe.extractor.downloader.Request
import org.schabi.newpipe.extractor.downloader.Response
import java.io.IOException
import java.util.concurrent.TimeUnit
import okhttp3.Request as OkHttpRequest

/**
 * Implementação mínima de [Downloader] exigida pelo NewPipe Extractor, usando OkHttp.
 *
 * IMPORTANTE: a assinatura exata de Downloader/Request/Response pode variar ligeiramente
 * entre versões do NewPipe Extractor. Este arquivo foi escrito para a série 0.26.x
 * (ver build.gradle deste módulo). Se o Android Studio apontar erros de "método não
 * encontrado" aqui, abra a classe org.schabi.newpipe.extractor.downloader.Downloader
 * pelo próprio IDE ("Go to declaration") e ajuste os nomes dos métodos para bater com
 * a versão realmente baixada.
 */
class OkHttpDownloader private constructor() : Downloader() {

    private val client: OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .followRedirects(true)
        .build()

    companion object {
        @JvmStatic
        val instance: OkHttpDownloader by lazy { OkHttpDownloader() }

        private const val USER_AGENT =
            "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) " +
                "Chrome/124.0.0.0 Mobile Safari/537.36"
    }

    @Throws(IOException::class)
    override fun execute(request: Request): Response {
        val httpMethod = request.httpMethod()
        val url = request.url()
        val headers = request.headers()
        val dataToSend = request.dataToSend()

        val builder = OkHttpRequest.Builder().url(url)

        val body = dataToSend?.let { it.toRequestBody(null, 0, it.size) }
        builder.method(httpMethod, body)

        if (headers["User-Agent"].isNullOrEmpty()) {
            builder.header("User-Agent", USER_AGENT)
        }

        for ((name, values) in headers) {
            if (values.isEmpty()) continue
            if (values.size == 1) {
                builder.header(name, values[0])
            } else {
                builder.removeHeader(name)
                values.forEach { value -> builder.addHeader(name, value) }
            }
        }

        client.newCall(builder.build()).execute().use { response ->
            if (response.code == 429) {
                throw IOException(
                    "HTTP 429: muitas requisições (rate limit do YouTube). Tente novamente mais tarde."
                )
            }

            val responseBodyString = response.body?.string().orEmpty()
            val latestUrl = response.request.url.toString()

            return Response(
                response.code,
                response.message,
                response.headers.toMultimap(),
                responseBodyString,
                latestUrl
            )
        }
    }
}
