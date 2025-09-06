let result = null;

async function load(concurso = "") {
  try {
   const res = await fetch(`http://localhost:3002/${concurso}`);
if (!res.ok) {
  throw new Error("Concurso não encontrado");
}

const text = await res.text();
if (!text) {
  throw new Error("Concurso inválido ou sem dados");
}

result = JSON.parse(text);
    render(result);
  } catch (err) {
    alert(err.message);
  }
}

function formatar(valor) {
  return parseFloat(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function render(data) {
  document.getElementById("title-concurso").textContent = `Concurso ${data.concurso} (${new Date(data.data_do_sorteio).toLocaleDateString("pt-BR")})`;

  for (let i = 1; i <= 6; i++) {
    document.getElementById(`bola${i}`).textContent = data[`bola${i}`].toString().padStart(2, "0");
  }

  document.getElementById("estimativa-premio").textContent = `R$\u00A0${formatar(data.estimativa_premio)}`;
  document.getElementById("acumulado-6-acertos").textContent = `R$\u00A0${formatar(data.acumulado_6_acertos)}`;
  document.getElementById("acumulado-sorteio-especial-mega-da-virada").textContent = `R$\u00A0${formatar(data.acumulado_sorteio_especial_mega_da_virada)}`;

  const g6 = data.ganhadores_6_acertos;
  const rateio6 = formatar(data.rateio_6_acertos);
  document.getElementById("ganhadores-6-acertos").textContent =
    g6 === 0 ? "Não houve ganhadores" : `${g6} aposta${g6 > 1 ? "s" : ""} ganhadora${g6 > 1 ? "s" : ""}, R$ ${rateio6}`;
  document.getElementById("acumulou").style.display = g6 === 0 ? "block" : "none";

  const g5 = data.ganhadores_5_acertos;
  document.getElementById("ganhadores-5-acertos").textContent =
    `${g5} aposta${g5 > 1 ? "s" : ""} ganhadora${g5 > 1 ? "s" : ""}, R$ ${formatar(data.rateio_5_acertos)}`;

  const g4 = data.ganhadores_4_acertos;
  document.getElementById("ganhadores-4-acertos").textContent =
    `${g4} aposta${g4 > 1 ? "s" : ""} ganhadora${g4 > 1 ? "s" : ""}, R$ ${formatar(data.rateio_4_acertos)}`;

  document.getElementById("cidade-uf").textContent = data.cidade_uf || "Local não informado";
  document.getElementById("arrecadacao-total").textContent = `R$ ${formatar(data.arrecadacao_total)}`;
}