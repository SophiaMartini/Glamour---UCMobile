
function abrirModal() {
    document.getElementById('modalFeedback').style.display = 'flex';
}


function fecharModal() {
    const estrelas = document.querySelector('input[name="rating"]:checked');
    const feedback = document.querySelector('textarea').value;

    console.log(`Estrelas selecionadas: ${estrelas ? estrelas.value : 'Nenhuma'}`);
    console.log(`Feedback: ${feedback}`);

    document.getElementById('modalFeedback').style.display = 'none';
}


document.querySelectorAll('.btn-feedback').forEach(button => {
    button.addEventListener('click', abrirModal);
});


document.querySelector('.btn-enviar').addEventListener('click', fecharModal);