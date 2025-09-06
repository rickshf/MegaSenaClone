const db = require("./db");
const router = require("express").Router();

// Retorna o concurso mais recente.
router.get("/", async function (req, res) {
  try {
    const result = await db.query(
      "SELECT * FROM megasena ORDER BY concurso DESC LIMIT 1"
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro:", error.message);
    res.json({ erro: "Erro interno do servidor" });
  }
});

// Retornar os dados de um determinado concurso.
router.get("/:concurso", async function (req, res) {
  const {concurso} = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM megasena WHERE concurso = $1",
      [concurso]
    );
    
     if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Concurso não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro:", error.message);
    res.json({ erro: "Erro interno do servidor" });
  }
});

// Inserir novo concurso
router.post("/", async (req, res) => {
    const data = req.body;

    // Verificar campos obrigatórios
      if (!data.concurso || !data.data_do_sorteio || !data.bola1 || !data.bola2 || !data.bola3 || !data.bola4 || !data.bola5 || !data.bola6) {
    return res.json({ erro: "Dados incompletos" });
  }

  try {
    await db.query(`
      INSERT INTO megasena (
        concurso, data_do_sorteio, bola1, bola2, bola3, bola4, bola5, bola6,
        ganhadores_6_acertos, cidade_uf, rateio_6_acertos, ganhadores_5_acertos,
        rateio_5_acertos, ganhadores_4_acertos, rateio_4_acertos,
        acumulado_6_acertos, arrecadacao_total, estimativa_premio,
        acumulado_sorteio_especial_mega_da_virada, observacao
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20
      )`, [
        data.concurso, data.data_do_sorteio, data.bola1, data.bola2, data.bola3, data.bola4, data.bola5, data.bola6,
        data.ganhadores_6_acertos, data.cidade_uf, data.rateio_6_acertos, data.ganhadores_5_acertos,
        data.rateio_5_acertos, data.ganhadores_4_acertos, data.rateio_4_acertos,
        data.acumulado_6_acertos, data.arrecadacao_total, data.estimativa_premio,
        data.acumulado_sorteio_especial_mega_da_virada, data.observacao
      ]
    );

    res.json({ mensagem: "Concurso inserido com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

// PUT - atualizar um concurso
router.put("/:concurso", async (req, res) => {
  const concurso = parseInt(req.params.concurso);
  const data = req.body;

  try {
    const result = await db.query("SELECT * FROM megasena WHERE concurso = $1", [concurso]);
    if (result.rows.length === 0) {
      return res.json({ erro: "Concurso não encontrado" });
    }

    await db.query(`
      UPDATE megasena SET
        data_do_sorteio = $1,
        bola1 = $2,
        bola2 = $3,
        bola3 = $4,
        bola4 = $5,
        bola5 = $6,
        bola6 = $7,
        ganhadores_6_acertos = $8,
        cidade_uf = $9,
        rateio_6_acertos = $10,
        ganhadores_5_acertos = $11,
        rateio_5_acertos = $12,
        ganhadores_4_acertos = $13,
        rateio_4_acertos = $14,
        acumulado_6_acertos = $15,
        arrecadacao_total = $16,
        estimativa_premio = $17,
        acumulado_sorteio_especial_mega_da_virada = $18,
        observacao = $19
      WHERE concurso = $20
    `, [
      data.data_do_sorteio, data.bola1, data.bola2, data.bola3, data.bola4, data.bola5, data.bola6,
      data.ganhadores_6_acertos, data.cidade_uf, data.rateio_6_acertos, data.ganhadores_5_acertos,
      data.rateio_5_acertos, data.ganhadores_4_acertos, data.rateio_4_acertos,
      data.acumulado_6_acertos, data.arrecadacao_total, data.estimativa_premio,
      data.acumulado_sorteio_especial_mega_da_virada, data.observacao, concurso
    ]);

    res.json({ mensagem: "Concurso atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

// DELETE /:concurso - deletar um concurso
router.delete("/:concurso", async (req, res) => {
  const concurso = parseInt(req.params.concurso);
  try {
    const result = await db.query("SELECT * FROM megasena WHERE concurso = $1", [concurso]);
    if (result.rows.length === 0) {
      return res.json({ erro: "Concurso não encontrado" });
    }

    await db.query("DELETE FROM megasena WHERE concurso = $1", [concurso]);
    res.json({ mensagem: "Concurso deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

module.exports = router;