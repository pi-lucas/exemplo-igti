const express = require("express")
const app = express()

const { check, validationResult } = require("express-validator")
const consultaCliente = require("./consulta-cliente")

app.use(express.json())

app.get("/", async(req,res) => {
    res.status(200).send("Bootcamp desenvolvedor backend")
})
app.post("/consulta-credito",
    check("nome", "Nome é obrigatório").notEmpty(),
    check("CPF", "CPF é obrigatório").notEmpty(),
    check("valor", "Valor é obrigatório e deve ser um número").notEmpty().isFloat(),
    check("parcelas", "Parcelas é obrigatório e deve ser um número inteiro").notEmpty().isInt(),

    async (req, res) => {
        const erros = validationResult(req)
        if(!erros.isEmpty()) {
            return res.status(400).json({ erro: erros.array() })
        }

        try {
            const valores = await consultaCliente.consultar(
                req.body.nome,
                req.body.CPF,
                req.body.valor,
                req.body.parcelas
            )

            res.status(201).json(valores)
        } catch (erro) {
            return res.status(405).json({ erro: erro.message })
        }
    }
)

module.exports = app