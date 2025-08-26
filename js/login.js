document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.form');
    const emailInput = document.getElementById('login');   // email ou telefone
    const senhaInput = document.getElementById('senha');   // senha
    const checkbox   = form.querySelector('input[type="checkbox"]'); // lembrar login
    const submitButton = form.querySelector('.btn');

    // Verificar se há dados salvos para "Lembre-se de mim"
    const dadosSalvos = localStorage.getItem('lembrarLogin');
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        emailInput.value = dados.email;
        checkbox.checked = true;
    }

    // Funções de validação
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validarTelefone(telefone) {
        const regex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;
        return regex.test(telefone);
    }

    function validarEmailOuTelefone(valor) {
        return validarEmail(valor) || validarTelefone(valor);
    }

    // Mostrar erro
    function mostrarErro(input, mensagem) {
        removerErro(input); // evita duplicar

        const erroDiv = document.createElement('div');
        erroDiv.className = 'erro-mensagem';
        erroDiv.style.color = '#ff4444';
        erroDiv.style.fontSize = '0.8em';
        erroDiv.style.marginTop = '5px';
        erroDiv.textContent = mensagem;

        input.parentElement.style.borderColor = '#ff4444';
        input.parentElement.insertAdjacentElement('afterend', erroDiv);
    }

    // Remover erro
    function removerErro(input) {
        const erro = input.parentElement.parentElement.querySelector('.erro-mensagem');
        if (erro) erro.remove();
        input.parentElement.style.borderColor = '#ddd';
    }

    // Buscar usuário no localStorage
    function buscarUsuario(email, senha) {
        // Usuário de teste padrão
        const usuarioTeste = {
            email: 'teste@email.com',
            nomeUsuario: 'teste@email.com',
            senha: '123456'
        };

        if ((usuarioTeste.email === email || usuarioTeste.nomeUsuario === email) && usuarioTeste.senha === senha) {
            return usuarioTeste;
        }

        // Buscar usuários cadastrados
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        return usuarios.find(user =>
            (user.email === email || user.nomeUsuario === email) && user.senha === senha
        );
    }

    // Fazer login
    function fazerLogin(email, senha) {
        const usuario = buscarUsuario(email, senha);

        if (usuario) {
            const sessao = {
                nomeUsuario: usuario.nomeUsuario,
                email: usuario.email,
                dataLogin: new Date().toISOString()
            };

            localStorage.setItem('usuarioLogado', JSON.stringify(sessao));

            if (checkbox.checked) {
                localStorage.setItem('lembrarLogin', JSON.stringify({ email }));
            } else {
                localStorage.removeItem('lembrarLogin');
            }

            return true;
        }

        return false;
    }

    // Validação em tempo real
    emailInput.addEventListener('blur', function() {
        if (!validarEmailOuTelefone(this.value.trim())) {
            mostrarErro(this, 'Digite um email válido ou número de telefone');
        } else {
            removerErro(this);
        }
    });

    senhaInput.addEventListener('blur', function() {
        if (this.value.length === 0) {
            mostrarErro(this, 'Senha é obrigatória');
        } else {
            removerErro(this);
        }
    });

    // Validar formulário
    function validarFormulario() {
        let valido = true;

        if (!validarEmailOuTelefone(emailInput.value.trim())) {
            mostrarErro(emailInput, 'Digite um email válido ou número de telefone');
            valido = false;
        }

        if (senhaInput.value.length === 0) {
            mostrarErro(senhaInput, 'Senha é obrigatória');
            valido = false;
        }

        return valido;
    }

    // Evento de clique no botão
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelectorAll('.erro-mensagem').forEach(erro => erro.remove());
        document.querySelectorAll('.input-entrada').forEach(input => {
            input.style.borderColor = '#ddd';
        });

        if (validarFormulario()) {
            const email = emailInput.value.trim();
            const senha = senhaInput.value;

            if (fazerLogin(email, senha)) {
                alert('Login realizado com sucesso!');
                window.location.href = 'catalogo.html'; // redireciona
                console.log('Usuário logado:', JSON.parse(localStorage.getItem('usuarioLogado')));
            } else {
                mostrarErro(senhaInput, 'Email/telefone ou senha incorretos');
            }
        }
    });

    // Pressionar Enter para enviar
    [emailInput, senhaInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitButton.click();
            }
        });
    });

    // Verificar sessão já ativa
    function verificarSessao() {
        const usuarioLogado = localStorage.getItem('usuarioLogado');
        if (usuarioLogado) {
            const dados = JSON.parse(usuarioLogado);
            console.log('Usuário já está logado:', dados);
            window.location.href = 'catalogo.html';
        }
    }
    verificarSessao();
});
