package org.uib

import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration
import com.github.javaparser.ast.body.MethodDeclaration
import com.github.javaparser.ast.body.VariableDeclarator
import com.github.javaparser.ast.expr.*
import com.github.javaparser.ast.stmt.ExpressionStmt
import com.github.javaparser.ast.visitor.VoidVisitorAdapter

class TranspilerVisitor(private val varToUnit: Map<String, String>) : VoidVisitorAdapter<StringBuilder>() {
    private var numericContext: Boolean = false

    override fun visit(n: ClassOrInterfaceDeclaration, arg: StringBuilder) {
        arg.append("class ").append(n.name).append(" {\n")
        super.visit(n, arg)
        arg.append("}\n")
    }


    override fun visit(n: ExpressionStmt, arg: StringBuilder) {
        // Need to use accept because n.expression is an Abstract type
        n.expression.accept(this, arg)
        arg.append(";\n")
    }

    override fun visit(n: MethodDeclaration, arg: StringBuilder) {
        arg.append(n.name).append("(): ").append(n.type).append(" {\n")
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
        arg.append(" ${n.operator} ")
        n.right.accept(this, arg)
        arg.append(")")
    }

    override fun visit(n: IntegerLiteralExpr, arg: StringBuilder) {
        arg.append(n.toString())
    }

    override fun visit(n: NameExpr, arg: StringBuilder) {
        if (varToUnit.contains(n.nameAsString)) {
            arg.append("$n")
        } else {
            arg.append(n)
        }
    }

    override fun visit(n: MethodCallExpr, arg: StringBuilder) {
    }

}