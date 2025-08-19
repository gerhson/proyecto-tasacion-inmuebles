// Carga datos del JSON
let preciosData = null;
fetch('precios.json')
  .then(res => res.json())
  .then(data => {
    preciosData = data;
    // Opcional: cargar dinámicamente Lima/Callao
    const ubigeoSelect = document.getElementById('ubigeo');
    ubigeoSelect.addEventListener('change', populateDistritos);
  });

const distritoSelect = document.getElementById('distrito');
const zonaSelect = document.getElementById('zona');
const btn = document.getElementById('btnCalcular');
const resultDiv = document.getElementById('resultado');

function populateDistritos() {
  const ubigeo = document.getElementById('ubigeo').value;
  distritoSelect.innerHTML = '<option value="">Seleccione distrito</option>';
  zonaSelect.innerHTML = '<option value="">Primero distrito</option>';
  if (!preciosData || !preciosData[ubigeo]) return;
  preciosData[ubigeo].forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.nombre;
    opt.textContent = d.nombre;
    distritoSelect.appendChild(opt);
  });
  distritoSelect.addEventListener('change', populateZonas);
}

function populateZonas() {
  const ubigeo = document.getElementById('ubigeo').value;
  const distrito = distritoSelect.value;
  zonaSelect.innerHTML = '<option value="">Seleccione zona</option>';
  const d = preciosData[ubigeo].find(d => d.nombre === distrito);
  if (!d) return;
  d.zonas.forEach(z => {
    const opt = document.createElement('option');
    opt.value = z.nombre;
    opt.textContent = z.nombre;
    zonaSelect.appendChild(opt);
  });
}

btn.addEventListener('click', () => {
  const ubigeo = document.getElementById('ubigeo').value;
  const distrito = distritoSelect.value;
  const zona = zonaSelect.value;
  const area = parseFloat(document.getElementById('area').value);
  if (!ubigeo || !distrito || !zona || isNaN(area) || area <= 0) {
    resultDiv.textContent = 'Por favor completa todos los campos correctamente.';
    return;
  }
  const d = preciosData[ubigeo].find(d => d.nombre === distrito);
  const z = d.zonas.find(z => z.nombre === zona);
  const precioM2 = z.precio_m2_usd;
  const valor = precioM2 * area;
  resultDiv.innerHTML = `Valor estimado en <b>${zona}, ${distrito}</b>:<br> <b>USD ${valor.toLocaleString()}</b>`;
});
