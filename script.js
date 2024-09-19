// Inicializar eventos
document.getElementById('iniciar').addEventListener('click', function () {
    const nome = document.getElementById('nome').value.trim(); // Remover espaços em branco

    if (nome) {
        localStorage.setItem('nomeCompleto', nome);  // Armazenar nome no localStorage com a chave "nomeCompleto"
        console.log('Nome salvo no localStorage:', nome); // Verificar se o nome foi salvo

        // Esconder a tela de inserção de nome
        document.getElementById('form-nome').style.display = 'none';

        // Mostrar a tela de presentes
        document.getElementById('tela-presentes').style.display = 'block';
    } else {
        alert('Por favor, insira seu nome completo!');
    }
});

// Armazenar presentes selecionados
let presentesSelecionados = [];

// Adicionar presentes à lista e alterar o botão para "Selecionado"
document.querySelectorAll('.escolher').forEach(button => {
    button.addEventListener('click', function () {
        const presente = this.getAttribute('data-presente');

        // Evitar que o presente seja selecionado mais de uma vez
        if (presentesSelecionados.includes(presente)) {
            alert('Este presente já foi selecionado!');
            return;
        }

        presentesSelecionados.push(presente);
        alert(`${presente} foi adicionado à sua lista!`);
        console.log('Presentes selecionados:', presentesSelecionados); // Verificar presentes

        // Alterar o texto do botão para "Selecionado" e mudar a cor
        this.textContent = 'Selecionado';
        this.classList.add('selecionado');  // Adiciona a classe CSS para mudar o estilo
        this.disabled = true;  // Desabilitar o botão para evitar seleção repetida
    });
});

// Enviar dados para Google Sheets
document.getElementById('enviar').addEventListener('click', function () {
    const nome = localStorage.getItem('nomeCompleto');  // Recuperar nome do localStorage com a chave "nomeCompleto"
    const dataHora = new Date().toLocaleString();  // Data e hora atual

    // Verificação de depuração
    console.log('Nome:', nome);
    console.log('DataHora:', dataHora);
    console.log('Presentes Selecionados:', presentesSelecionados);

    if (!nome || nome === "") {
        alert('Nome não encontrado. Por favor, insira seu nome novamente.');
        return;
    }

    if (presentesSelecionados.length === 0) {
        alert('Por favor, selecione ao menos um presente.');
        return;
    }

    // Dados a serem enviados (campos correspondem exatamente às colunas da planilha)
    const sheetData = {
        "data": [
            {
                "data": dataHora,  // Nome da coluna "data" na planilha
                "nomeCompleto": nome.trim(),  // Nome da coluna "nomeCompleto" na planilha
                "presentes": presentesSelecionados.join(', ')  // Nome da coluna "presentes" na planilha
            }
        ]
    };

    // Verificação de depuração para garantir que os dados estão corretos
    console.log('Dados a serem enviados:', sheetData);

    // Fazer a requisição POST para o SheetDB
    fetch('https://sheetdb.io/api/v1/lilmqffgjyxmh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetData),  // Enviar os dados no formato correto
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar registro no Google Sheets');
        }
        return response.json();
    })
    .then(data => {
        alert('Lista enviada com sucesso! Obrigado por participar do nosso Chá de Panela!');
        console.log('Sucesso:', data);
        // Limpar lista de presentes selecionados
        presentesSelecionados = [];
    })
    .catch((error) => {
        console.error('Erro:', error);
        alert('Houve um erro ao enviar sua lista. Detalhes do erro: ' + error.message);
    });
});

// Definir o limite de quantidade para cada presente (exemplo: 2 para "Conjunto de Panelas")
const limitesPresentes = {
    "Conjunto de Panelas": 2,
    "Conjunto de Talheres": 2,
    "Jogo de Toalhas": 3
};

// Função para verificar o status da planilha e atualizar a disponibilidade
function verificarDisponibilidadePresentes() {
    fetch('https://sheetdb.io/api/v1/lilmqffgjyxmh')  // Substitua pelo seu endpoint da SheetDB
        .then(response => response.json())
        .then(data => {
            // Mapear os presentes contados
            const contagemPresentes = {};

            data.forEach(item => {
                const presentesSelecionados = item.presentes.split(', ');
                presentesSelecionados.forEach(presente => {
                    if (!contagemPresentes[presente]) {
                        contagemPresentes[presente] = 1;
                    } else {
                        contagemPresentes[presente]++;
                    }
                });
            });

            // Verificar se algum presente atingiu o limite
            document.querySelectorAll('.escolher').forEach(button => {
                const presente = button.getAttribute('data-presente');
                const quantidade = contagemPresentes[presente] || 0;
                const limite = limitesPresentes[presente];

                // Se a quantidade for igual ou superior ao limite, o presente fica indisponível
                if (quantidade >= limite) {
                    button.textContent = 'Indisponível';
                    button.disabled = true;
                    button.classList.add('indisponivel');  // Classe para estilo de indisponível
                } else {
                    button.textContent = 'Escolher';
                    button.disabled = false;
                    button.classList.remove('indisponivel');
                }
            });
        })
        .catch(error => {
            console.error('Erro ao verificar a planilha:', error);
        });
}

// Executar a função imediatamente ao carregar a página
verificarDisponibilidadePresentes();

// Definir uma rotina para executar a função a cada 2 minutos (120000 ms)
setInterval(verificarDisponibilidadePresentes, 120000);
