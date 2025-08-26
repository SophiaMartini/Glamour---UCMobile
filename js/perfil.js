const editBtn = document.getElementById("edit-btn");
const editSection = document.getElementById("editSection");
const profileView = document.getElementById("profileView");

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileTelefone = document.getElementById("profileTelefone");
const profileIdade = document.getElementById("profileIdade");
const profilePhoto = document.getElementById("profilePhoto");

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const telefoneInput = document.getElementById("telefoneInput");
const idadeInput = document.getElementById("idadeInput");
const photoInput = document.getElementById("photoInput");
const editPhotoPreview = document.getElementById("editPhotoPreview");

const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");


editPhotoPreview.addEventListener("click", () => {
  photoInput.click();
});

photoInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    editPhotoPreview.src = e.target.result;
  };
  reader.readAsDataURL(file);
});


editBtn.addEventListener('click', () => {
  editSection.classList.add('open');
  
  nameInput.value = profileName.textContent;
  emailInput.value = profileEmail.textContent;
  telefoneInput.value = profileTelefone.textContent;
  idadeInput.value = profileIdade.textContent;
  editPhotoPreview.src = profilePhoto.src;
});


cancelBtn.addEventListener("click", () => {
  editSection.classList.remove("open");
  profileView.classList.remove("dimmed");
  photoInput.value = "";
  editPhotoPreview.src = profilePhoto.src;
});


telefoneInput.addEventListener("input", () => {
  let valor = telefoneInput.value.replace(/\D/g, ""); // Remove tudo que não for número
  if (valor.length > 11) valor = valor.slice(0, 11); // Limita a 11 números

  
  if (valor.length > 6) {
    valor = valor.replace(/(\d{2})(\d)(\d{4})(\d{0,4})/, "($1)$2 $3-$4");
  } else if (valor.length > 2) {
    valor = valor.replace(/(\d{2})(\d{0,5})/, "($1)$2");
  }

  telefoneInput.value = valor;
});


saveBtn.addEventListener("click", () => {
  
  if (
    nameInput.value.trim() === "" ||
    emailInput.value.trim() === "" ||
    telefoneInput.value.trim() === "" ||
    idadeInput.value.trim() === ""
  ) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  
  const telefoneValido = /^\(\d{2}\)\d \d{4}-\d{4}$/.test(telefoneInput.value);
  if (!telefoneValido) {
    alert("Por favor, insira um telefone válido no formato (XX)X XXXX-XXXX.");
    return;
  }

  
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
  if (!emailValido) {
    alert("Por favor, insira um email válido.");
    return;
  }

  
  const idade = parseInt(idadeInput.value, 10);
  if (isNaN(idade) || idade <= 0 || idade > 120) {
    alert("Por favor, insira uma idade válida.");
    return;
  }

  
  profileName.textContent = nameInput.value;
  profileEmail.textContent = emailInput.value;
  profileTelefone.textContent = telefoneInput.value;
  profileIdade.textContent = idadeInput.value;
  profilePhoto.src = editPhotoPreview.src;

  
  const perfil = {
    nome: nameInput.value,
    email: emailInput.value,
    telefone: telefoneInput.value,
    idade: idadeInput.value,
    foto: editPhotoPreview.src
  };

  localStorage.setItem("perfilUsuario", JSON.stringify(perfil));

  
  editSection.classList.remove("open");
  profileView.classList.remove("dimmed");
  photoInput.value = "";

  alert("Perfil atualizado com sucesso!");
});


window.addEventListener("DOMContentLoaded", () => {
  const dadosSalvos = localStorage.getItem("perfilUsuario");
  if (dadosSalvos) {
    const perfil = JSON.parse(dadosSalvos);

    profileName.textContent = perfil.nome;
    profileEmail.textContent = perfil.email;
    profileTelefone.textContent = perfil.telefone;
    profileIdade.textContent = perfil.idade;
    profilePhoto.src = perfil.foto;
  }
});
