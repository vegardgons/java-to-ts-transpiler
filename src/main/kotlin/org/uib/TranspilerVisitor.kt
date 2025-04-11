package org.uib

import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration
import com.github.javaparser.ast.body.MethodDeclaration
import com.github.javaparser.ast.body.VariableDeclarator
import com.github.javaparser.ast.expr.BinaryExpr
import com.github.javaparser.ast.expr.IntegerLiteralExpr
import com.github.javaparser.ast.expr.MethodCallExpr
import com.github.javaparser.ast.expr.NameExpr
import com.github.javaparser.ast.stmt.ExpressionStmt
import com.github.javaparser.ast.visitor.VoidVisitorAdapter

class TranspilerVisitor(private val varToUnit: Map<String, String>) : VoidVisitorAdapter<StringBuilder>() {
    private var numericContext: Boolean = false

    override fun visit(n: ClassOrInterfaceDeclaration, arg: StringBuilder) {
        arg.append("class ").append(n.name).append(" {\n")
        super.visit(n, arg)
        arg.append("}\n")
        arg.append("new Example().main();")
    }


    override fun visit(n: ExpressionStmt, arg: StringBuilder) {
        // Need to use accept because n.expression is an Abstract type
        n.expression.accept(this, arg)
        arg.append(";\n")
    }

    override fun visit(n: MethodDeclaration, arg: StringBuilder) {
        if (n.nameAsString == "main") {
            arg.append(n.name).append("(): ").append(n.type).append(" {\n")
        } else {
            arg.append("function ${n.name}(${n.parameters.joinToString { it.nameAsString }});\n")
        }
        super.visit(n, arg)
        arg.append("}\n")
    }

    override fun visit(n: VariableDeclarator, arg: StringBuilder) {
        val varName = n.nameAsString
        val varValue = n.initializer.map { it.toString() }.orElse("undefined")
        val varUnit = varToUnit[varName]
        if (varUnit != null) {
            arg.append("let $varName: Unit = new Unit(\"$varUnit\", $varValue)")
        } else {
            arg.append("let $varName = $varValue")
        }
    }

    override fun visit(n: BinaryExpr, arg: StringBuilder) {
        arg.append("(")
        n.left.accept(this, arg)
        arg.append(" ${n.operator.asString()} ")
        n.right.accept(this, arg)
        arg.append(")")

    }

    override fun visit(n: IntegerLiteralExpr, arg: StringBuilder) {
        arg.append(n.toString())
    }

    override fun visit(n: NameExpr, arg: StringBuilder) {
        if (varToUnit.contains(n.nameAsString)) {
            arg.append("baseValue($n)")
        } else {
            arg.append(n)
        }
    }

    override fun visit(n: MethodCallExpr, arg: StringBuilder) {
        val exprText = n.getArgument(0).toString()
        if (n.name.asString() == "println" &&
            exprText.contains(Regex("[+\\-/*]")) &&
            varToUnit.keys.any { exprText.contains(it) }
        ) {
            arg.append("console.log(new Unit(inferUnitKind(")
            arg.append("\"")

            n.arguments[0].toString().split(" ").forEach { expr ->
                arg.append(
                    varToUnit.getOrDefault(
                        expr.filter { it.isLetter() },
                        expr.filter { c -> !")(".contains(c) }
                    )
                )
            }
            val lastToken = exprText.split(" ").last().filter { it.isLetter() || it.isDigit() }
            if (!varToUnit.containsKey(lastToken)) {
                arg.setLength(arg.length - lastToken.length - 1)
            }
            arg.append("\"), ")

            n.childNodes[2].accept(this, arg)
            arg.append("))")
        } else {
            arg.append("console.log(")
            n.arguments[0].accept(this, arg)
            arg.append(")")
        }
    }
}