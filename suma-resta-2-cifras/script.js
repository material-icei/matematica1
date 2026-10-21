/* =========================================================
   Sumas y restas hasta 99 - 1° grado
   Cálculo reflexivo por descomposición (decenas / unidades)
   Sin reagrupación. 10 sumas y 10 restas.
   Recompensas: álbum de stickers + personaje que avanza.
   ========================================================= */

const EJERCICIOS_POR_MODO = 10;
const EJERCICIOS_GUIADOS = 3; // en estos primeros ejercicios se corrige cada casillero

/* ---------- Configuración de cada modo ---------- */
const MODOS = {
  suma: {
    nombre: "sumas",
    titulo: "➕ Sumas hasta 99",
    signo: "+",
    mascota: "🐰",
    meta: "🥕",
    frase: "¡El conejo llegó a la zanahoria!",
    stickers: ["🦁", "🐼", "🦊", "🐸", "🐙", "🦄", "🐢", "🦋", "🐝", "🐬"],
    historias: [
      { emoji: "🍎", texto: "En la verdulería había {a} manzanas rojas y llegaron {b} manzanas verdes. ¿Cuántas manzanas hay en total?" },
      { emoji: "🎈", texto: "Para el cumpleaños de Lola inflaron {a} globos rojos y {b} globos azules. ¿Cuántos globos inflaron en total?" },
      { emoji: "🖍️", texto: "En la caja de la seño hay {a} crayones y Tomás trajo {b} crayones más. ¿Cuántos crayones hay ahora?" },
      { emoji: "🐟", texto: "En la pecera grande hay {a} peces naranjas y {b} peces amarillos. ¿Cuántos peces hay en total?" },
      { emoji: "🎴", texto: "Rafa tiene {a} figuritas y su abuela le regaló {b} figuritas más. ¿Cuántas figuritas tiene ahora?" },
      { emoji: "🍪", texto: "La abuela horneó {a} galletitas de vainilla y {b} galletitas de chocolate. ¿Cuántas galletitas horneó en total?" },
      { emoji: "🚌", texto: "En el micro escolar viajan {a} chicos y en la parada suben {b} chicos más. ¿Cuántos chicos viajan ahora?" },
      { emoji: "🌼", texto: "En el cantero de la escuela hay {a} flores amarillas y {b} flores rosas. ¿Cuántas flores hay en total?" },
      { emoji: "🔘", texto: "Mateo juntó {a} tapitas verdes y {b} tapitas azules. ¿Cuántas tapitas juntó en total?" },
      { emoji: "📚", texto: "En la biblioteca del aula hay {a} libros de cuentos y llegaron {b} libros nuevos. ¿Cuántos libros hay ahora?" }
    ]
  },
  resta: {
    nombre: "restas",
    titulo: "➖ Restas hasta 99",
    signo: "−",
    mascota: "🐻",
    meta: "🍯",
    frase: "¡El oso llegó a la miel!",
    stickers: ["🚀", "🌈", "⚽", "🎸", "🍦", "🚂", "🌋", "🍕", "🏰", "🎠"],
    historias: [
      { emoji: "🎈", texto: "Para la fiesta inflaron {a} globos y se pincharon {b}. ¿Cuántos globos quedaron?" },
      { emoji: "🍬", texto: "Julián tenía {a} caramelos y convidó {b} a sus amigos. ¿Cuántos caramelos le quedan?" },
      { emoji: "🐦", texto: "En el árbol había {a} pajaritos y se volaron {b}. ¿Cuántos pajaritos quedaron en el árbol?" },
      { emoji: "🍪", texto: "En la bandeja había {a} galletitas y los chicos comieron {b}. ¿Cuántas galletitas quedan?" },
      { emoji: "🎴", texto: "Sofía tenía {a} figuritas y pegó {b} en el álbum. ¿Cuántas figuritas le quedan para pegar?" },
      { emoji: "🚌", texto: "En el micro viajaban {a} personas y en la parada bajaron {b}. ¿Cuántas personas siguen viajando?" },
      { emoji: "🍎", texto: "En el cajón había {a} manzanas y se vendieron {b}. ¿Cuántas manzanas quedan?" },
      { emoji: "🪙", texto: "Renata tenía {a} pesos y gastó {b} pesos en un helado. ¿Cuántos pesos le quedan?" },
      { emoji: "🧁", texto: "La panadería preparó {a} pastelitos y vendió {b} a la mañana. ¿Cuántos pastelitos le quedan?" },
      { emoji: "🖍️", texto: "En la caja había {a} crayones y Nico repartió {b} a sus compañeros. ¿Cuántos crayones quedaron en la caja?" }
    ]
  }
};

/* ---------- Estado del juego ---------- */
let modoActual = null;
const estado = { suma: null, resta: null };        // progreso de cada modo por separado
const album = { suma: new Set(), resta: new Set() }; // stickers ganados en esta sesión
let bloqueado = false;
let temporizadorSiguiente = null;

function azar(n) { return Math.floor(Math.random() * n); }

function ejercicioActual() {
  if (!modoActual || !estado[modoActual]) return null;
  const est = estado[modoActual];
  return est.indice < EJERCICIOS_POR_MODO ? est.ejercicios[est.indice] : null;
}

function esModoGuiado() {
  return modoActual && estado[modoActual].indice < EJERCICIOS_GUIADOS;
}

/* ---------- Generación de números de 2 cifras SIN reagrupación ----------
   Suma: las unidades suman menos de 10 y el resultado no pasa de 99.
   Resta: el primer número es mayor y sus unidades nunca son menores
   que las del segundo (no hay que "pedir prestado"). */
function generarNumeros(modo) {
  let dA, dB, uA, uB;
  if (modo === "suma") {
    dA = 1 + azar(8);          // 1 a 8
    dB = 1 + azar(9 - dA);     // 1 a (9 - dA)
    uA = azar(10);             // 0 a 9
    uB = azar(10 - uA);        // 0 a (9 - uA)
  } else {
    dA = 2 + azar(8);          // 2 a 9
    dB = 1 + azar(dA - 1);     // 1 a (dA - 1)
    uA = azar(10);             // 0 a 9
    uB = azar(uA + 1);         // 0 a uA
  }
  return { a: dA * 10 + uA, b: dB * 10 + uB };
}

/* Valores correctos de cada casillero del esquema:
   1) cada número se separa en decena y unidad (D1, U1, D2, U2)
   2) se agrupan decenas con decenas y unidades con unidades (D1b, D2b, U1b, U2b)
   3) se resuelve cada grupo por separado (parcialD, parcialU)
   4) se juntan los dos resultados parciales (final) */
function calcularEsperados(a, b, modo) {
  const D1 = Math.floor(a / 10) * 10, U1 = a % 10;
  const D2 = Math.floor(b / 10) * 10, U2 = b % 10;
  const esSuma = modo === "suma";
  const parcialD = esSuma ? D1 + D2 : D1 - D2;
  const parcialU = esSuma ? U1 + U2 : U1 - U2;
  return {
    D1, U1, D2, U2,
    D1b: D1, D2b: D2, U1b: U1, U2b: U2,
    parcialD, parcialU,
    final: parcialD + parcialU
  };
}

function nuevoEstado(modo) {
  const historias = [...MODOS[modo].historias].sort(() => Math.random() - 0.5);
  const usados = new Set();
  const ejercicios = historias.slice(0, EJERCICIOS_POR_MODO).map((historia) => {
    let nums;
    do { nums = generarNumeros(modo); } while (usados.has(nums.a + "-" + nums.b));
    usados.add(nums.a + "-" + nums.b);
    const esperados = calcularEsperados(nums.a, nums.b, modo);
    return { ...historia, a: nums.a, b: nums.b, esperados, resultado: esperados.final };
  });
  return { ejercicios, indice: 0 };
}

/* =========================================================
   Construcción visual del esquema (una sola vez)
   Espacio virtual de referencia: 960 x 480
   ========================================================= */
const ANCHO_V = 960;
const ALTO_V = 480;

function pctX(x) { return (x / ANCHO_V * 100) + "%"; }
function pctY(y) { return (y / ALTO_V * 100) + "%"; }

// {id, x, y, w, h, tipo, tono, pista}
const CASILLEROS = [
  { id: "boxA", x: 300, y: 55, w: 110, h: 58, tipo: "fija" },
  { id: "boxB", x: 660, y: 55, w: 110, h: 58, tipo: "fija" },

  // Nivel 1: cada número se separa en decenas y unidades
  { id: "D1", x: 240, y: 170, w: 90, h: 54, tipo: "input", tono: "d", pista: "D" },
  { id: "U1", x: 360, y: 170, w: 90, h: 54, tipo: "input", tono: "u", pista: "U" },
  { id: "D2", x: 600, y: 170, w: 90, h: 54, tipo: "input", tono: "d", pista: "D" },
  { id: "U2", x: 720, y: 170, w: 90, h: 54, tipo: "input", tono: "u", pista: "U" },

  // Nivel 2: decenas con decenas, unidades con unidades
  { id: "D1b", x: 220, y: 285, w: 90, h: 54, tipo: "input", tono: "d" },
  { id: "D2b", x: 380, y: 285, w: 90, h: 54, tipo: "input", tono: "d" },
  { id: "U1b", x: 580, y: 285, w: 90, h: 54, tipo: "input", tono: "u" },
  { id: "U2b", x: 740, y: 285, w: 90, h: 54, tipo: "input", tono: "u" },

  // Nivel 3: resultados parciales y resultado final
  { id: "parcialD", x: 300, y: 405, w: 90, h: 54, tipo: "input", tono: "d" },
  { id: "parcialU", x: 660, y: 405, w: 90, h: 54, tipo: "input", tono: "u" },
  { id: "final", x: 850, y: 405, w: 118, h: 62, tipo: "destacada" }
];

const ORDEN_INPUTS = ["D1", "U1", "D2", "U2", "D1b", "D2b", "U1b", "U2b", "parcialD", "parcialU", "final"];

// del: true → el signo cambia según el modo (+ o −)
const OPERADORES = [
  { x: 480, y: 55, del: true },

  { simbolo: "+", x: 300, y: 170 },
  { simbolo: "+", x: 660, y: 170 },

  { x: 300, y: 285, del: true },
  { x: 660, y: 285, del: true },

  { simbolo: "+", x: 480, y: 405 },
  { simbolo: "=", x: 755, y: 405 }
];

// Azul = decenas, Rojo = unidades
const LINEAS = [
  [300, 84, 240, 143, "azul"],
  [300, 84, 360, 143, "roja"],
  [660, 84, 600, 143, "azul"],
  [660, 84, 720, 143, "roja"],

  [240, 197, 220, 258, "azul"],
  [600, 197, 380, 258, "azul"],
  [360, 197, 580, 258, "roja"],
  [720, 197, 740, 258, "roja"],

  [220, 312, 300, 378, "azul"],
  [380, 312, 300, 378, "azul"],
  [580, 312, 660, 378, "roja"],
  [740, 312, 660, 378, "roja"]
];

const LETREROS = [
  { texto: "decenas", x: 300, y: 455, clase: "d" },
  { texto: "unidades", x: 660, y: 455, clase: "u" }
];

function construirDiagrama() {
  const contenedor = document.getElementById("diagrama");
  contenedor.innerHTML = "";

  // Líneas primero (quedan detrás de los casilleros)
  LINEAS.forEach(([x1, y1, x2, y2, color]) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const largo = Math.hypot(dx, dy);
    const angulo = Math.atan2(dy, dx) * (180 / Math.PI);

    const linea = document.createElement("div");
    linea.className = "linea " + color;
    linea.style.left = pctX(x1);
    linea.style.top = pctY(y1);
    linea.style.width = (largo / ANCHO_V * 100) + "%";
    linea.style.transform = `rotate(${angulo}deg)`;
    contenedor.appendChild(linea);
  });

  // Operadores
  OPERADORES.forEach((op) => {
    const el = document.createElement("div");
    el.className = "operador" + (op.del ? " del-modo" : "");
    el.textContent = op.simbolo || "+";
    el.style.left = pctX(op.x - 14);
    el.style.top = pctY(op.y - 16);
    el.style.width = pctX(28);
    el.style.height = pctY(32);
    contenedor.appendChild(el);
  });

  // Letreros "decenas" / "unidades"
  LETREROS.forEach((l) => {
    const el = document.createElement("div");
    el.className = "letrero " + l.clase;
    el.textContent = l.texto;
    el.style.left = pctX(l.x);
    el.style.top = pctY(l.y);
    contenedor.appendChild(el);
  });

  // Casilleros
  CASILLEROS.forEach((c) => {
    const el = document.createElement("div");
    el.className = "caja";
    if (c.tipo === "fija") el.classList.add("fija");
    if (c.tipo === "destacada") el.classList.add("destacada");
    if (c.tono) el.classList.add("tono-" + c.tono);
    el.id = "caja-" + c.id;
    el.style.left = pctX(c.x - c.w / 2);
    el.style.top = pctY(c.y - c.h / 2);
    el.style.width = pctX(c.w);
    el.style.height = pctY(c.h);

    if (c.tipo !== "fija") {
      const input = document.createElement("input");
      input.type = "text";
      input.inputMode = "numeric";
      input.autocomplete = "off";
      input.maxLength = 2;
      input.id = "input-" + c.id;
      input.placeholder = c.tipo === "destacada" ? "?" : (c.pista || "");

      // Solo números, hasta 2 cifras
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(0, 2);
        el.classList.remove("revisar");
      });

      // Enter: pasa al casillero siguiente o verifica
      input.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        if (c.id === "final") {
          verificarRespuesta();
        } else {
          const siguiente = ORDEN_INPUTS[ORDEN_INPUTS.indexOf(c.id) + 1];
          document.getElementById("input-" + siguiente)?.focus();
        }
      });

      if (c.tipo !== "destacada") {
        // En los primeros ejercicios se corrige cada casillero al completarlo
        input.addEventListener("blur", () => {
          const ej = ejercicioActual();
          if (!ej || bloqueado || !esModoGuiado()) return;
          if (input.readOnly || input.value.trim() === "") return;

          if (parseInt(input.value, 10) === ej.esperados[c.id]) {
            el.classList.remove("error", "revisar");
            el.classList.add("correcto");
            input.readOnly = true;
            sonar([660], 0.1);
          } else {
            el.classList.add("error");
            sonar([220], 0.18, "triangle");
            setTimeout(() => {
              el.classList.remove("error");
              input.value = "";
              input.focus();
            }, 450);
          }
        });
      }
      el.appendChild(input);
    }
    contenedor.appendChild(el);
  });
}

function construirEstaciones() {
  const cont = document.getElementById("estaciones");
  cont.innerHTML = "";
  for (let k = 1; k < EJERCICIOS_POR_MODO; k++) {
    const punto = document.createElement("div");
    punto.className = "estacion";
    punto.style.left = (k / EJERCICIOS_POR_MODO * 100) + "%";
    cont.appendChild(punto);
  }
}

function ajustarTamañoDiagrama() {
  const wrapper = document.querySelector(".diagrama-wrapper");
  const diagrama = document.getElementById("diagrama");
  if (!wrapper || !diagrama) return;

  const maxAncho = wrapper.clientWidth;
  const maxAlto = wrapper.clientHeight;
  if (maxAncho <= 0 || maxAlto <= 0) return;

  const proporcion = ANCHO_V / ALTO_V;
  let ancho = maxAncho;
  let alto = ancho / proporcion;

  if (alto > maxAlto) {
    alto = maxAlto;
    ancho = alto * proporcion;
  }

  diagrama.style.width = ancho + "px";
  diagrama.style.height = alto + "px";
  diagrama.style.setProperty("--escala", (ancho / ANCHO_V).toFixed(4));
}

/* =========================================================
   Cambio de modo (sumas / restas)
   ========================================================= */
function cambiarModo(modo) {
  clearTimeout(temporizadorSiguiente);
  bloqueado = false;
  document.getElementById("sticker-ganado").classList.add("oculto");
  document.getElementById("pantalla-inicio").classList.add("oculto");
  document.getElementById("pantalla-final").classList.add("oculto");
  document.getElementById("pantalla-album").classList.add("oculto");

  modoActual = modo;
  if (!estado[modo]) estado[modo] = nuevoEstado(modo);

  const cfg = MODOS[modo];
  document.body.dataset.modo = modo;
  document.getElementById("titulo").textContent = cfg.titulo;
  document.querySelectorAll(".btn-modo").forEach((b) => {
    b.classList.toggle("activo", b.dataset.modo === modo);
  });
  document.querySelectorAll(".operador.del-modo").forEach((op) => {
    op.textContent = cfg.signo;
  });

  if (estado[modo].indice >= EJERCICIOS_POR_MODO) {
    actualizarCamino(false);
    mostrarFinal();
  } else {
    cargarEjercicio();
  }
  requestAnimationFrame(ajustarTamañoDiagrama);
}

/* =========================================================
   Carga y control de ejercicios
   ========================================================= */
function cargarEjercicio() {
  const ej = ejercicioActual();
  if (!ej) return;

  document.getElementById("emoji-personaje").textContent = ej.emoji;
  document.getElementById("texto-problema").textContent =
    ej.texto.replace("{a}", ej.a).replace("{b}", ej.b);

  document.getElementById("caja-boxA").textContent = ej.a;
  document.getElementById("caja-boxB").textContent = ej.b;

  // Limpiar todos los casilleros (valor, bloqueo y estilos)
  document.querySelectorAll(".caja input").forEach((inp) => {
    inp.value = "";
    inp.readOnly = false;
  });
  document.querySelectorAll(".caja").forEach((c) => {
    c.classList.remove("correcto", "error", "revisar");
  });
  const feedback = document.getElementById("feedback");
  feedback.textContent = esModoGuiado()
    ? "💡 Separá cada número en decenas y unidades."
    : "";
  feedback.className = "feedback";

  actualizarCamino(false);
  document.getElementById("input-D1").focus();
}

function actualizarCamino(animar) {
  const est = estado[modoActual];
  const cfg = MODOS[modoActual];
  const pct = Math.min(est.indice, EJERCICIOS_POR_MODO) / EJERCICIOS_POR_MODO * 100;

  const mascota = document.getElementById("mascota");
  const meta = document.getElementById("meta");
  mascota.textContent = cfg.mascota;
  meta.textContent = cfg.meta;
  mascota.style.left = pct + "%";
  document.getElementById("camino-relleno").style.width = pct + "%";

  document.querySelectorAll(".estacion").forEach((p, i) => {
    p.classList.toggle("hecha", i + 1 <= est.indice);
  });

  if (animar) {
    mascota.classList.remove("salto");
    void mascota.offsetWidth; // reinicia la animación
    mascota.classList.add("salto");
  }
  meta.classList.toggle("alcanzada", est.indice >= EJERCICIOS_POR_MODO);

  document.getElementById("contador").textContent = est.indice >= EJERCICIOS_POR_MODO
    ? "¡Completado! 🎉"
    : `Ejercicio ${est.indice + 1} de ${EJERCICIOS_POR_MODO}`;
}

function verificarRespuesta() {
  if (bloqueado) return;
  const ej = ejercicioActual();
  if (!ej) return;

  const inputFinal = document.getElementById("input-final");
  const cajaFinal = document.getElementById("caja-final");
  const valor = parseInt(inputFinal.value, 10);
  const feedback = document.getElementById("feedback");

  if (isNaN(valor)) {
    feedback.textContent = "✍️ Completá el resultado final antes de verificar.";
    feedback.className = "feedback incorrecto";
    inputFinal.focus();
    return;
  }

  if (valor === ej.resultado) {
    bloqueado = true;
    const est = estado[modoActual];
    const cfg = MODOS[modoActual];

    feedback.textContent = "🎉 ¡Muy bien! Resultado correcto.";
    feedback.className = "feedback correcto";
    cajaFinal.classList.remove("error");
    cajaFinal.classList.add("correcto");
    inputFinal.readOnly = true;
    sonar([523, 659, 784], 0.12);
    lanzarConfeti(14);

    // Recompensa 1: sticker para el álbum
    const yaLoTenia = album[modoActual].has(est.indice);
    album[modoActual].add(est.indice);
    mostrarStickerGanado(cfg.stickers[est.indice], yaLoTenia);
    actualizarContadorStickers(!yaLoTenia);

    // Recompensa 2: el personaje avanza un casillero
    est.indice++;
    actualizarCamino(true);

    temporizadorSiguiente = setTimeout(() => {
      bloqueado = false;
      document.getElementById("sticker-ganado").classList.add("oculto");
      if (est.indice < EJERCICIOS_POR_MODO) {
        cargarEjercicio();
      } else {
        mostrarFinal();
      }
    }, 1900);
  } else {
    sonar([220], 0.2, "triangle");
    const hayErrores = marcarCasillerosParaRevisar(ej);
    feedback.textContent = hayErrores
      ? "🤔 Revisá los casilleros marcados, ¡vos podés!"
      : "🤔 Revisá tus cálculos: juntá las decenas y las unidades.";
    feedback.className = "feedback incorrecto";
    cajaFinal.classList.add("error");
    setTimeout(() => {
      cajaFinal.classList.remove("error");
      inputFinal.value = "";
      inputFinal.focus();
    }, 450);
  }
}

/* Marca los casilleros intermedios completados con un valor equivocado */
function marcarCasillerosParaRevisar(ej) {
  let hayErrores = false;
  ORDEN_INPUTS.forEach((id) => {
    if (id === "final") return;
    const inp = document.getElementById("input-" + id);
    if (inp.value === "") return;
    if (parseInt(inp.value, 10) !== ej.esperados[id]) {
      hayErrores = true;
      document.getElementById("caja-" + id).classList.add("revisar");
    }
  });
  return hayErrores;
}

/* =========================================================
   Recompensas: stickers y álbum
   ========================================================= */
function mostrarStickerGanado(sticker, yaLoTenia) {
  document.getElementById("sticker-grande").textContent = sticker;
  document.getElementById("texto-sticker").textContent = yaLoTenia
    ? "¡Muy bien! Este sticker ya está en tu álbum."
    : "¡Ganaste un sticker nuevo!";
  const aviso = document.getElementById("sticker-ganado");
  aviso.classList.remove("oculto");
  // reinicia la animación de entrada
  aviso.style.animation = "none";
  void aviso.offsetWidth;
  aviso.style.animation = "";
  if (!yaLoTenia) sonar([784, 988, 1175], 0.1);
}

function totalStickers() {
  return album.suma.size + album.resta.size;
}

function actualizarContadorStickers(destacar) {
  const total = MODOS.suma.stickers.length + MODOS.resta.stickers.length;
  document.getElementById("contador-stickers").textContent = `${totalStickers()}/${total}`;
  if (destacar) {
    const btn = document.getElementById("btn-album");
    btn.classList.remove("brillo");
    void btn.offsetWidth;
    btn.classList.add("brillo");
  }
}

function abrirAlbum() {
  ["suma", "resta"].forEach((modo) => {
    const grilla = document.getElementById("album-" + modo);
    grilla.innerHTML = "";
    MODOS[modo].stickers.forEach((sticker, i) => {
      const slot = document.createElement("div");
      const ganado = album[modo].has(i);
      slot.className = "slot" + (ganado ? "" : " bloqueado");
      slot.textContent = ganado ? sticker : "❔";
      grilla.appendChild(slot);
    });
  });
  const faltan = MODOS.suma.stickers.length + MODOS.resta.stickers.length - totalStickers();
  document.getElementById("texto-album").textContent = faltan === 0
    ? "🌟 ¡Completaste todo el álbum! 🌟"
    : `Te faltan ${faltan} stickers. ¡Cada cuenta bien resuelta te da uno!`;

  document.getElementById("pantalla-final").classList.add("oculto");
  document.getElementById("pantalla-album").classList.remove("oculto");
}

function cerrarAlbum() {
  document.getElementById("pantalla-album").classList.add("oculto");
  if (!modoActual) return;
  if (estado[modoActual].indice >= EJERCICIOS_POR_MODO) {
    mostrarFinal(false);
  } else {
    document.getElementById("input-D1").focus();
  }
}

/* =========================================================
   Pantalla final de cada modo
   ========================================================= */
function mostrarFinal(festejar = true) {
  const cfg = MODOS[modoActual];
  const otro = modoActual === "suma" ? "resta" : "suma";

  document.getElementById("trofeo").textContent = cfg.meta + "🏆";
  document.getElementById("titulo-final").textContent = `¡Terminaste las ${cfg.nombre}!`;
  document.getElementById("texto-final").textContent =
    `${cfg.frase} Estos son tus stickers de ${cfg.nombre}:`;
  document.getElementById("final-stickers").textContent =
    cfg.stickers.filter((s, i) => album[modoActual].has(i)).join(" ");

  const total = MODOS.suma.stickers.length + MODOS.resta.stickers.length;
  document.getElementById("album-completo").classList.toggle("oculto", totalStickers() < total);

  const btnOtro = document.getElementById("btn-otro-modo");
  btnOtro.textContent = otro === "resta" ? "Practicar restas ➖" : "Practicar sumas ➕";
  btnOtro.classList.toggle("a-suma", otro === "suma");

  document.getElementById("pantalla-final").classList.remove("oculto");
  if (festejar) {
    lanzarConfeti(60);
    sonar([523, 659, 784, 1047], 0.15);
  }
}

function reiniciarModo() {
  estado[modoActual] = nuevoEstado(modoActual);
  document.getElementById("pantalla-final").classList.add("oculto");
  cargarEjercicio();
}

/* ---------- Sonidos (Web Audio, sin archivos externos) ---------- */
let contextoAudio = null;

function sonar(frecuencias, duracion = 0.12, tipo = "sine") {
  try {
    contextoAudio = contextoAudio || new (window.AudioContext || window.webkitAudioContext)();
    frecuencias.forEach((f, i) => {
      const osc = contextoAudio.createOscillator();
      const gan = contextoAudio.createGain();
      const t = contextoAudio.currentTime + i * duracion;
      osc.type = tipo;
      osc.frequency.value = f;
      gan.gain.setValueAtTime(0.0001, t);
      gan.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
      gan.gain.exponentialRampToValueAtTime(0.0001, t + duracion);
      osc.connect(gan).connect(contextoAudio.destination);
      osc.start(t);
      osc.stop(t + duracion + 0.02);
    });
  } catch (e) {
    /* si el navegador no permite audio, la actividad sigue igual */
  }
}

/* ---------- Confeti ---------- */
const EMOJIS_CONFETI = ["🎉", "⭐", "🎊", "✨", "🏅"];

function lanzarConfeti(cantidad) {
  const contenedor = document.getElementById("confetti-container");
  for (let i = 0; i < cantidad; i++) {
    const pieza = document.createElement("span");
    pieza.className = "confeti";
    pieza.textContent = EMOJIS_CONFETI[Math.floor(Math.random() * EMOJIS_CONFETI.length)];
    pieza.style.left = Math.random() * 100 + "vw";
    const duracion = 2 + Math.random() * 1.5;
    pieza.style.animationDuration = duracion + "s";
    contenedor.appendChild(pieza);
    setTimeout(() => pieza.remove(), duracion * 1000 + 100);
  }
}

/* ---------- Inicialización ---------- */
document.addEventListener("DOMContentLoaded", () => {
  construirDiagrama();
  construirEstaciones();
  ajustarTamañoDiagrama();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarTamañoDiagrama);

  // Botones de elegir modo (pantalla de inicio y cabecera)
  document.querySelectorAll(".btn-modo, .opcion-inicio").forEach((btn) => {
    btn.addEventListener("click", () => cambiarModo(btn.dataset.modo));
  });

  document.getElementById("btn-verificar").addEventListener("click", verificarRespuesta);
  document.getElementById("btn-album").addEventListener("click", abrirAlbum);
  document.getElementById("btn-cerrar-album").addEventListener("click", cerrarAlbum);
  document.getElementById("btn-ver-album").addEventListener("click", abrirAlbum);
  document.getElementById("btn-reiniciar").addEventListener("click", reiniciarModo);
  document.getElementById("btn-otro-modo").addEventListener("click", () => {
    cambiarModo(modoActual === "suma" ? "resta" : "suma");
  });

  let temporizadorResize = null;
  window.addEventListener("resize", () => {
    clearTimeout(temporizadorResize);
    temporizadorResize = setTimeout(ajustarTamañoDiagrama, 120);
  });
});
