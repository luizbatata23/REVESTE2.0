function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = soma % 11;
  let d1 = resto < 2 ? 0 : 11 - resto;
  if (d1 !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = soma % 11;
  let d2 = resto < 2 ? 0 : 11 - resto;
  return d2 === parseInt(cpf[10]);
}

function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, '');
  if (cnpj.length !== 14) return false;
 if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const calc = (cnpj, n) => {
    let soma = 0, pos = n - 7;
    for (let i = n; i >= 1; i--) {
      soma += parseInt(cnpj[n - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    return soma % 11 < 2 ? 0 : 11 - (soma % 11);
  };

  return calc(cnpj, 12) === parseInt(cnpj[12]) && calc(cnpj, 13) === parseInt(cnpj[13]);
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefone(telefone) {
  const nums = telefone.replace(/\D/g, '');
  return nums.length >= 10 && nums.length <= 11;
}

function mostrarErro(id, mensagem) {
  const campo = document.getElementById(id);
  if (campo) campo.style.borderColor = 'red';
  const err = document.getElementById('err-' + id);
  if (err) err.textContent = mensagem;
}

function limparErro(id) {
  const campo = document.getElementById(id);
  if (campo) campo.style.borderColor = '';
  const err = document.getElementById('err-' + id);
  if (err) err.textContent = '';
}

async function cadastrar() {
  const nome = document.getElementById('nome').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const loja = document.getElementById('loja').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('msg');

  ['nome', 'cpf', 'loja', 'telefone', 'email'].forEach(limparErro);
  msg.textContent = '';

  let valido = true;

  if (!nome) { mostrarErro('nome', 'Nome é obrigatório'); valido = false; }

  const cpfLimpo = cpf.replace(/\D/g, '');
  if (!cpf) {
    mostrarErro('cpf', 'CPF ou CNPJ é obrigatório'); valido = false;
  } else if (cpfLimpo.length <= 11 && !validarCPF(cpfLimpo)) {
    mostrarErro('cpf', 'CPF inválido'); valido = false;
  } else if (cpfLimpo.length > 11 && !validarCNPJ(cpfLimpo)) {
    mostrarErro('cpf', 'CNPJ inválido'); valido = false;
  }

  if (!loja) { mostrarErro('loja', 'Nome da loja é obrigatório'); valido = false; }

  if (!telefone) {
    mostrarErro('telefone', 'Telefone é obrigatório'); valido = false;
  } else if (!validarTelefone(telefone)) {
    mostrarErro('telefone', 'Telefone inválido (mínimo 10 dígitos)'); valido = false;
  }

  if (!email) {
    mostrarErro('email', 'Email é obrigatório'); valido = false;
  } else if (!validarEmail(email)) {
    mostrarErro('email', 'Email inválido'); valido = false;
  }

  if (!valido) return;

  try {
    const res = await fetch('http://localhost:8080/vendedor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, cpf: cpfLimpo, loja, telefone: telefone.replace(/\D/g, ''), email })
    });

    const data = await res.json();
    msg.style.color = data.success ? 'green' : 'red';
    msg.textContent = data.message;

    if (data.success) {
      ['nome', 'cpf', 'loja', 'telefone', 'email'].forEach(id => {
        document.getElementById(id).value = '';
      });
    }
  } catch (err) {
    msg.style.color = 'red';
    msg.textContent = 'Erro ao conectar com o servidor.';
  }
}