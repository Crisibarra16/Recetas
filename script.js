const btn = document.getElementById("btn-receta");
const container = document.getElementById("receta-container");

let recetaActual = null; // Aquí guardamos temporalmente la receta actual

btn.addEventListener("click", obtenerReceta);

function obtenerReceta() {
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(data => {
      recetaActual = data.meals[0]; // Guardamos la receta actual
      mostrarReceta(recetaActual);
    })
    .catch(err => {
      container.innerHTML = "<p>Error al obtener la receta.</p>";
      console.error(err);
    });
}

function mostrarReceta(meal) {
  const ingredientes = [];

  for (let i = 1; i <= 20; i++) {
    const ingrediente = meal[`strIngredient${i}`];
    const medida = meal[`strMeasure${i}`];
    if (ingrediente && ingrediente.trim()) {
      ingredientes.push(`${ingrediente} - ${medida}`);
    }
  }

  container.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <h3>Ingredientes:</h3>
    <ul>${ingredientes.map(i => `<li>${i}</li>`).join('')}</ul>
    <h3>Instrucciones:</h3>
    <p>${meal.strInstructions}</p>
    <button id="btn-favorita">Guardar como favorita</button>
  `;

  // Asignamos evento al botón luego de que fue agregado al DOM
  document.getElementById("btn-favorita").addEventListener("click", guardarFavorita);
}

function guardarFavorita() {
  const favoritas = JSON.parse(localStorage.getItem('favoritas')) || [];

  if (favoritas.find(r => r.idMeal === recetaActual.idMeal)) {
    alert('¡Ya está guardada!');
    return;
  }

  favoritas.push(recetaActual);
  localStorage.setItem('favoritas', JSON.stringify(favoritas));
  alert('Receta guardada en favoritos.');
}
