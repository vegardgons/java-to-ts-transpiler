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
    }

    override fun visit(n: VariableDeclarator, arg: StringBuilder) {
    }

    override fun visit(n: BinaryExpr, arg: StringBuilder) {
    }

    override fun visit(n: IntegerLiteralExpr, arg: StringBuilder) {
    }

    override fun visit(n: NameExpr, arg: StringBuilder) {
    }

    override fun visit(n: MethodCallExpr, arg: StringBuilder) {
    }
}