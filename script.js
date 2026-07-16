let receitas = {};
let nomesIngredientes = {};

const ID_FOLHA = "1wIUdHQPey7cv5cAEHotRBNIFTy3dN5Zcu2GUJaI8W9s";

const GID_INGREDIENTES_POR_RECEITA = "1767423248";
const GID_INGREDIENTES = "1270545888";

async function lerFolha(gid) {
  const url =
    `https://docs.google.com/spreadsheets/d/${ID_FOLHA}/gviz/tq` +
    `?tqx=out:json&gid=${gid}`;

  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error("Não foi possível ler a folha Google Sheets.");
  }

  const texto = await resposta.text();

  return JSON.parse(
    texto
      .replace("/*O_o*/", "")
      .replace("google.visualization.Query.setResponse(", "")
      .slice(0, -2)
  );
}

async function carregarDados() {
  const [dadosReceitas, dadosIngredientes] = await Promise.all([
    lerFolha(GID_INGREDIENTES_POR_RECEITA),
    lerFolha(GID_INGREDIENTES)
  ]);

  // Folha "Ingredientes":
  // Coluna A = código (ex.: I002)
  // Coluna B = nome (ex.: Bacalhau)
  dadosIngredientes.table.rows.forEach(linha => {
    const valores = linha.c;

    if (!valores || !valores[0] || !valores[1]) return;

    const codigo = String(valores[0].v).trim();
    const nome = String(valores[1].v).trim();

    nomesIngredientes[codigo] = nome;
  });

  // Folha "Ingredientes por receitas":
  // Coluna A = ID da receita
  // Coluna B = código do ingrediente
  // Coluna C = quantidade
  // Coluna D = unidade
  dadosReceitas.table.rows.forEach(linha => {
    const valores = linha.c;

    if (!valores || !valores[0]) return;

    const idReceita = String(valores[0].v).trim();
    const codigoIngrediente = String(valores[1]?.v ?? "").trim();
    const quantidade = valores[2]?.v ?? "";
    const unidade = valores[3]?.v ?? "";

    const nomeIngrediente =
      nomesIngredientes[codigoIngrediente] ?? codigoIngrediente;

    if (!receitas[idReceita]) {
      receitas[idReceita] = [];
    }

    receitas[idReceita].push([
      nomeIngrediente,
      quantidade,
      unidade
    ]);
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
        </tr>`;
    });
  } else {
    tabela.innerHTML =
      "<tr><td colspan='3'>Receita não encontrada.</td></tr>";
  }
}

carregarDados().catch(erro => {
  console.error(erro);

  document.querySelector("#resultado tbody").innerHTML =
    "<tr><td colspan='3'>Erro ao carregar as receitas.</td></tr>";
});
