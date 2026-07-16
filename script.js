let receitas = {};

const ID_FOLHA = "1wIUdHQPey7cv5cAEHotRBNIFTy3dN5Zcu2GUJaI8W9s";
const GID_FOLHA = "0";

async function carregarReceitas() {
  const url =
    `https://docs.google.com/spreadsheets/d/${ID_FOLHA}/gviz/tq?tqx=out:json&gid=${GID_FOLHA}`;

  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error("Não foi possível ler a folha Google Sheets.");
  }

  const texto = await resposta.text();
  const dados = JSON.parse(texto.substring(47, texto.length - 2));
  const linhas = dados.table.rows;

  linhas.forEach(linha => {
    const valores = linha.c;

    if (!valores || !valores[0]) return;

    const id = String(valores[0].v).trim();
    const ingrediente = valores[1]?.v ?? "";
    const quantidade = valores[2]?.v ?? "";
    const unidade = valores[3]?.v ?? "";

    if (!receitas[id]) {
      receitas[id] = [];
    }

    receitas[id].push([ingrediente, quantidade, unidade]);
  });
}

function procurar() {
  const id = document.getElementById("receita").value.trim();
  const tabela = document.querySelector("#resultado tbody");

  tabela.innerHTML = "";

  if (receitas[id]) {
    receitas[id].forEach(item => {
      tabela.innerHTML += `
        <tr>
          <td>${item[0]}</td>
          <td>${item[1]}</td>
          <td>${item[2]}</td>
        </tr>
      `;
    });
  } else {
    tabela.innerHTML =
      "<tr><td colspan='3'>Receita não encontrada.</td></tr>";
  }
}

carregarReceitas().catch(erro => {
  console.error(erro);

  document.querySelector("#resultado tbody").innerHTML =
    "<tr><td colspan='3'>Erro ao carregar as receitas.</td></tr>";
});
