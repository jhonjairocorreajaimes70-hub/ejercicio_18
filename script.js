// Capturamos los elementos principales del documento HTML que vamos a manipular
const languageSelect = document.getElementById('languageSelect');
const resultContainer = document.getElementById('resultContainer');
const refreshBtn = document.getElementById('refreshBtn');
// Escuchamos cuando el usuario cambia la opción seleccionada en el menú desplegable
languageSelect.addEventListener('change', function() {
    const lenguajeSeleccionado = languageSelect.value; // obtenemos el lenguaje elegido
    if (lenguajeSeleccionado) {
        buscarRepositorioAleatorio(lenguajeSeleccionado); // llamamos a la función de búsqueda
    }
});
// Escuchamos el clic en el botón de refresco para buscar otro repositorio del mismo lenguaje
refreshBtn.addEventListener('click', function() {
    const lenguajeSeleccionado = languageSelect.value; // obtenemos el lenguaje actual
    if (lenguajeSeleccionado) {
        buscarRepositorioAleatorio(lenguajeSeleccionado); // volvemos a realizar la petición a la API
    }
});
// Función asincrónica para consultar la API de GitHub y gestionar los estados de UI
async function buscarRepositorioAleatorio(lenguaje) {
    // 1. ESTADO DE CARGA: Mostramos mensaje mientras esperamos la respuesta de la red
    resultContainer.className = 'contenedor-resultado estado-cargando';
    resultContainer.innerHTML = 'espere un moment, estamos buscando el repositorio..';
    refreshBtn.classList.add('oculto'); // ocultamos el botón mientras carga
    try {
        // Construimos la URL de la API de búsqueda de GitHub filtrando por lenguaje
        const url = `https://api.github.com/search/repositories?q=language:${lenguaje}&sort=stars&order=desc`;
        // Hacemos la solicitud HTTP asincrónica usando fetch
        const respuesta = await fetch(url);
        // Validamos si la respuesta del servidor no fue exitosa
        if (!respuesta.ok) {
            throw new Error('Error al conectar con la API'); // lanzamos un error para que lo atrape el catch
        }
        const datos = await respuesta.json(); // convertimos la respuesta a formato JSON
        // 2. ESTADO VACÍO: Verificamos si la API no devolvió ningún repositorio
        if (datos.items.length === 0) {
            resultContainer.className = 'contenedor-resultado estado-vacio';
            resultContainer.innerHTML = 'No repositories found for this language.';
            refreshBtn.classList.add('oculto');
            return; // detenemos la ejecución
        }
        // Seleccionamos un repositorio de manera aleatoria entre los resultados obtenidos
        const indiceAleatorio = Math.floor(Math.random() * datos.items.length);
        const repoAleatorio = datos.items[indiceAleatorio];

        // 3. ESTADO EXITOSO: Pintamos los datos del repositorio en la interfaz
        resultContainer.className = 'contenedor-resultado estado-exito';
        resultContainer.innerHTML = `
            <div class="info-repo">
                <h3>${repoAleatorio.name}</h3>
                <p>${repoAleatorio.description ? repoAleatorio.description : 'No description available.'}</p>
                <div class="detalles-repo">
                    <span>⭐ ${repoAleatorio.stargazers_count}</span>
                    <span>🍴 ${repoAleatorio.forks_count}</span>
                    <span>⚠️ ${repoAleatorio.open_issues_count}</span>
                </div>
            </div>
        `;

        refreshBtn.classList.remove('oculto'); // mostramos el botón de refresco tras una búsqueda exitosa

    } catch (error) {
        // 4. ESTADO DE ERROR: Capturamos cualquier fallo de red o error en la petición
        resultContainer.className = 'contenedor-resultado estado-error';
        resultContainer.innerHTML = 'ERROR: tuvimos problemas con la API o la  conexion al internet';
        refreshBtn.classList.remove('oculto'); // permitimos reintentar con el botón
    }
}