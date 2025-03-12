package org.uib

import com.github.javaparser.GeneratedJavaParserConstants
import com.github.javaparser.JavaToken
import com.github.javaparser.StaticJavaParser
import com.github.javaparser.TokenRange
import com.github.javaparser.ast.CompilationUnit
import com.github.javaparser.ast.body.VariableDeclarator
import com.github.javaparser.ast.expr.VariableDeclarationExpr
import java.util.function.Consumer
import java.util.regex.Pattern

class JavaTSTranspiler {
    private val varToUnit: MutableMap<String, String> = HashMap()

    fun run() {
        val javaCode: String = readFileFromResources("Example.java")
        val cu = StaticJavaParser.parse(javaCode)
        val tsCode = StringBuilder()
        val skeleton = readFileFromPath("ts/src/base.ts")

        populateVarToUnit(cu)
        tsCode.appendLine(skeleton)
        cu.accept(TranspilerVisitor(varToUnit), tsCode)
        saveFileWithContents(tsCode.toString(), "ts/src/transpiled.ts")
    }

    private fun populateVarToUnit(cu: CompilationUnit) {
        val regex = "" // TODO!!
        // write a regex pattern to capture anything inside a multi-line comment: /* */
        val pattern = Pattern.compile(regex)

        cu.findAll(VariableDeclarationExpr::class.java).forEach(Consumer { v: VariableDeclarationExpr ->
            val tokenRange = v.tokenRange
            tokenRange.ifPresent { range: TokenRange ->
                range.forEach(Consumer { token: JavaToken ->
                    if (token.kind == GeneratedJavaParserConstants.MULTI_LINE_COMMENT) {
                        val matcher = pattern.matcher(token.text)
                        if (matcher.find()) {
                            val unit = matcher.group(1).trim()
                            v.variables.forEach(Consumer { varDec: VariableDeclarator ->
                                varToUnit[varDec.nameAsString] = unit
                            })
                        }
                    }
                })
            }
        })
    }
}