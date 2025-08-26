document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.form');
    const inputs = form.querySelectorAll('input');
    const submitButton = form.querySelector('.btn');
    
    const nomeUsuario = inputs[0];
    const email = inputs[1];
    const dataNascimento = inputs[2];
    const senha = inputs[3];
    const confirmarSenha = inputs[4];
    
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
    
    function mostrarErro(input, mensagem) {
        const erroAnterior = input.parentElement.querySelector('.erro-mensagem');
        if (erroAnterior) {
            erroAnterior.remove();
        }
       
        const erroDiv = document.createElement('div');
        erroDiv.className = 'erro-mensagem';
        erroDiv.style.color = '#ff4444';
        erroDiv.style.fontSize = '0.8em';
        erroDiv.style.marginTop = '5px';
        erroDiv.textContent = mensagem;
        
        input.parentElement.style.borderColor = '#ff4444';
        
        input.parentElement.insertAdjacentElement('afterend', erroDiv);
    }
    
    function removerErro(input) {
        const erro = input.parentElement.parentElement.querySelector('.erro-mensagem');
        if (erro) {
            erro.remove();
        }
        input.parentElement.style.borderColor = '#ddd';
    }
    
    // Validação em tempo real
    nomeUsuario.addEventListener('blur', function() {
        if (this.value.trim().length < 3) {
            mostrarErro(this, 'Nome de usuário deve ter pelo menos 3 caracteres');
        } else {
            removerErro(this);
        }
    });
    
    email.addEventListener('blur', function() {
        if (!validarEmailOuTelefone(this.value.trim())) {
            mostrarErro(this, 'Digite um email válido ou número de telefone');
        } else {
            removerErro(this);
        }
    });
    
    dataNascimento.addEventListener('blur', function() {
        if (!this.value) {
            mostrarErro(this, 'Data de nascimento é obrigatória');
        } else {
            const hoje = new Date();
            const nascimento = new Date(this.value);
            const idade = hoje.getFullYear() - nascimento.getFullYear();
            
            if (idade < 18) {
                mostrarErro(this, 'Você deve ter pelo menos 18 anos');
            } else {
                removerErro(this);
            }
        }
    });
    
    senha.addEventListener('blur', function() {
        if (this.value.length < 6) {
            mostrarErro(this, 'Senha deve ter pelo menos 6 caracteres');
        } else {
            removerErro(this);
        }
    });
    
    confirmarSenha.addEventListener('blur', function() {
        if (this.value !== senha.value) {
            mostrarErro(this, 'Senhas não coincidem');
        } else {
            removerErro(this);
        }
    });
    
    // Função para validar formulário completo
    function validarFormulario() {
        let valido = true;
        
        // Validar nome de usuário
        if (nomeUsuario.value.trim().length < 3) {
            mostrarErro(nomeUsuario, 'Nome de usuário deve ter pelo menos 3 caracteres');
            valido = false;
        }
        
        // Validar email/telefone
        if (!validarEmailOuTelefone(email.value.trim())) {
            mostrarErro(email, 'Digite um email válido ou número de telefone');
            valido = false;
        }
        
        // Validar data de nascimento
        if (!dataNascimento.value) {
            mostrarErro(dataNascimento, 'Data de nascimento é obrigatória');
            valido = false;
        } else {
            const hoje = new Date();
            const nascimento = new Date(dataNascimento.value);
            const idade = hoje.getFullYear() - nascimento.getFullYear();
            
            if (idade < 18) {
                mostrarErro(dataNascimento, 'Você deve ter pelo menos 18 anos');
                valido = false;
            }
        }
        
        // Validar senha
        if (senha.value.length < 6) {
            mostrarErro(senha, 'Senha deve ter pelo menos 6 caracteres');
            valido = false;
        }
        
        // Validar confirmação de senha
        if (confirmarSenha.value !== senha.value) {
            mostrarErro(confirmarSenha, 'Senhas não coincidem');
            valido = false;
        }
        
        return valido;
    }
    
    // Função para salvar usuário no localStorage
    function salvarUsuario(dadosUsuario) {
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        // Verificar se usuário já existe
        const usuarioExiste = usuarios.find(user => 
            user.email === dadosUsuario.email || user.nomeUsuario === dadosUsuario.nomeUsuario
        );
        
        if (usuarioExiste) {
            alert('Usuário já cadastrado com este email ou nome de usuário!');
            return false;
        }
        
        usuarios.push(dadosUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        return true;
    }
    
    // Event listener para o botão de registro
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remover erros anteriores
        document.querySelectorAll('.erro-mensagem').forEach(erro => erro.remove());
        document.querySelectorAll('.input-entrada').forEach(input => {
            input.style.borderColor = '#ddd';
        });
        
        if (validarFormulario()) {
            const dadosUsuario = {
                nomeUsuario: nomeUsuario.value.trim(),
                email: email.value.trim(),
                dataNascimento: dataNascimento.value,
                senha: senha.value,
                dataRegistro: new Date().toISOString()
            };
            
            if (salvarUsuario(dadosUsuario)) {
                alert('Usuário registrado com sucesso!');
                // Redirecionar para página de login
                window.location.href = 'login.html';
            }
        }
    });
    
    // Permitir envio com Enter
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitButton.click();
            }
        });
    });
});