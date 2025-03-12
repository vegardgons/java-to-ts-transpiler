package org.uib

import java.io.InputStream
import java.nio.charset.Charset
import java.nio.file.Files
import java.nio.file.Paths
import java.io.File

fun saveFileWithContents(contents: String, path: String) {
    Files.write(Paths.get(path), contents.toByteArray())
}

fun readFileFromResources(path: String): String {
    val inputStream: InputStream = JavaTSTranspiler::class.java.classLoader.getResourceAsStream(path)
        ?: throw IllegalArgumentException("File not found in resources")
    return inputStream.bufferedReader(Charset.defaultCharset()).use { it.readText() }
}

fun readFileFromPath(path: String): String {
    val file = File(path)
    if (!file.exists()) throw IllegalArgumentException("File not found: $path")
    return file.readText(Charset.defaultCharset())
}