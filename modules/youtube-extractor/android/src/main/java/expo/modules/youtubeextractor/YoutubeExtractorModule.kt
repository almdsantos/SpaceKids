package expo.modules.youtubeextractor

import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.schabi.newpipe.extractor.NewPipe
import org.schabi.newpipe.extractor.ServiceList
import org.schabi.newpipe.extractor.stream.AudioStream
import org.schabi.newpipe.extractor.stream.StreamInfo
import org.schabi.newpipe.extractor.stream.VideoStream
import java.util.concurrent.Executors

private val backgroundExecutor = Executors.newCachedThreadPool()

private fun resolutionHeight(resolution: String?): Int =
    resolution?.filter { it.isDigit() }?.toIntOrNull() ?: 0

private fun VideoStream.toMap(progressive: Boolean): Map<String, Any?> = mapOf(
    "url" to url,
    "mimeType" to (format?.mimeType ?: "video/mp4"),
    "resolution" to resolution,
    "isProgressive" to progressive
)

private fun AudioStream.toMap(): Map<String, Any?> = mapOf(
    "url" to url,
    "mimeType" to (format?.mimeType ?: "audio/mp4"),
    "averageBitrate" to averageBitrate
)

class YoutubeExtractorModule : Module() {

    companion object {
        @Volatile
        private var initialized = false

        @Synchronized
        private fun ensureInitialized() {
            if (!initialized) {
                NewPipe.init(OkHttpDownloader.instance)
                initialized = true
            }
        }
    }

    override fun definition() = ModuleDefinition {
        Name("YoutubeExtractor")

        // Retorna TODOS os streams encontrados (ver seção 18 do contexto: teste isolado).
        AsyncFunction("getStreams") { videoId: String, promise: Promise ->
            backgroundExecutor.execute {
                try {
                    ensureInitialized()
                    val info = StreamInfo.getInfo(
                        ServiceList.YouTube,
                        "https://www.youtube.com/watch?v=$videoId"
                    )

                    val result = mapOf(
                        "id" to info.id,
                        "name" to info.name,
                        "durationSeconds" to info.duration,
                        "progressiveStreams" to info.videoStreams
                            .orEmpty()
                            .filter { !it.url.isNullOrEmpty() }
                            .map { it.toMap(progressive = true) },
                        "videoOnlyStreams" to info.videoOnlyStreams
                            .orEmpty()
                            .filter { !it.url.isNullOrEmpty() }
                            .map { it.toMap(progressive = false) },
                        "audioStreams" to info.audioStreams
                            .orEmpty()
                            .filter { !it.url.isNullOrEmpty() }
                            .map { it.toMap() }
                    )

                    promise.resolve(result)
                } catch (e: Exception) {
                    promise.reject("ERR_YOUTUBE_EXTRACTOR", e.message ?: "Falha ao extrair streams", e)
                }
            }
        }

        // Retorna diretamente a melhor URL progressiva (áudio+vídeo), pronta para o expo-video.
        AsyncFunction("getStreamUrl") { videoId: String, promise: Promise ->
            backgroundExecutor.execute {
                try {
                    ensureInitialized()
                    val info = StreamInfo.getInfo(
                        ServiceList.YouTube,
                        "https://www.youtube.com/watch?v=$videoId"
                    )

                    val best = info.videoStreams
                        .orEmpty()
                        .filter { !it.url.isNullOrEmpty() }
                        .maxByOrNull { resolutionHeight(it.resolution) }

                    if (best == null) {
                        promise.reject(
                            "ERR_NO_PROGRESSIVE_STREAM",
                            "Nenhum stream progressivo (áudio+vídeo) disponível para este vídeo. " +
                                "Use getStreams() para inspecionar videoOnlyStreams/audioStreams.",
                            null
                        )
                        return@execute
                    }

                    val result = mapOf(
                        "url" to best.url,
                        "mimeType" to (best.format?.mimeType ?: "video/mp4"),
                        "quality" to best.resolution,
                        "isProgressive" to true
                    )

                    promise.resolve(result)
                } catch (e: Exception) {
                    promise.reject("ERR_YOUTUBE_EXTRACTOR", e.message ?: "Falha ao extrair stream", e)
                }
            }
        }
    }
}
