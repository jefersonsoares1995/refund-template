// Seleciona os elementos do formulário.
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleciona os elementos da lista.
const expenseList = document.querySelector("ul");
const expensesTotal = document.querySelector("aside header h2");
const expenseQuantity = document.querySelector("aside header p span");

// Captura o evento de input para formatar o valor.
amount.oninput = () => {
  // Obtém o valor do input e remove os caracteres não numéricos.
  let value = amount.value.replace(/\D/g, "");

  // Tranformar o valor em centavos (exemplo: 150/100 = 1.5 que é equivalente a R$ 1,50).
  value = Number(value) / 100;

  // Atualiza o valor do input.
  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  // Formata o valor no padrão BRL (Real Brasileiro).
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Retorna o valor formatado.
  return value;
}

// Captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) => {
  // Previne o comportamento para padrão de fazer recarregar a página.
  event.preventDefault();

  // Cria um objeto com os detalhes na nova despesa.
  const newEpexnse = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  // Chama a função que irá adicionar o item na lista
  expenseAdd(newEpexnse);
};

// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    // Cria o elemento de para adicionar o item (li) na lista (ul).
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // Cria o ícone da categoria.
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // Cria a info da despesa.
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    // cria o nome da despesa.
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    // Cria a categoria da despesa.
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Adiciona nome e categoria na div das informações da despensa
    expenseInfo.append(expenseName, expenseCategory);

    // Cria o valor da despesa.
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    // Cria o icone de remover.
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    // Adiciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    // Adiciona o item na lista.
    expenseList.append(expenseItem);

    // Limpa o formulário para adicionar um novo item.
    formClear();

    // Atualiza os totais.
    updateTotals();
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas. ");
    console.log(error);
  }
}

// Atualiza os totais.
function updateTotals() {
  try {
    // Recupera todos os itens (li) da lista (ul)
    const items = expenseList.children;

    // Atualiza a quantidade de itens na lista
    expenseQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    // Variável  para incrementar o total.

    let total = 0;

    // Percorre cada item (li) da lista (ul)
    for (let item = 0; item < items.length; item++) {
      // Recupera o valor da despesa
      const itemAmount = items[item].querySelector(".expense-amount");

      // Remover caracteres não numéricos e susbstitui a vírgula pelo ponto.
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      // Converte o valor para float.
      value = parseFloat(value);

      // Verifica se é um número válido.
      if (isNaN(value)) {
        return alert(
          "Não foi possível calcular o total. O valor não parece ser um número."
        );
      }

      // Incrementar o valor total.
      total += Number(value);
    }

    // Cria a span para adicionar o R$ fromatado.
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    // Formata o valor e remove o R$ que será exibido pella small com um estilo customizado.
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    // Limpa o conteúdo do elemento.
    expensesTotal.innerHTML = "";

    // adicionar o símbolo da moeda e o valor total formatado.
    expensesTotal.append(symbolBRL, total);
  } catch (error) {
    console.log(error);
    alert("Não foi possível atualizar os totais.");
  }
}

// Evento que captura o clique nos itens na lista.
expenseList.addEventListener("click", function (event) {
  // Verifica se o evento é um clique no icone de remover.
  if (event.target.classList.contains("remove-icon")) {
    // Pega o item (li) que foi clicado.
    const item = event.target.closest(".expense");

    // Remove o item da lista.
    item.remove();
  }
  // Atualiza os totais.
  updateTotals();
});

function formClear() {
  // Limpa os valores dos inputs.
  amount.value = "";
  expense.value = "";
  category.value = "";

  // Coloca o foco no input de despesa.
  expense.focus();
}
