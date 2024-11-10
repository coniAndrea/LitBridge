const formulario = document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');

const expresiones = {
	nombre_usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, números, guion y guion_bajo
	contraseña: /^.{4,12}$/, // 4 a 12 dígitos.
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
};

const campos = {
	nombre_usuario: false,
	contraseña: false,
	correo: false,
};

const validarFormulario = (e) => {
	switch (e.target.name) {
		case "nombre_usuario":
			validarCampo(expresiones.nombre_usuario, e.target, 'nombre_usuario');
			break;
		case "contraseña":
			validarCampo(expresiones.contraseña, e.target, 'contraseña');
			validarPassword2();
			break;
		case "contraseña2":
			validarPassword2();
			break;
		case "correo":
			validarCampo(expresiones.correo, e.target, 'correo');
			break;
	}
};

const validarCampo = (expresion, input, campo) => {
	if (expresion.test(input.value)) {
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
		document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
		campos[campo] = true;
	} else {
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
		document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
		campos[campo] = false;
	}
};

const validarPassword2 = () => {
	const inputPassword1 = document.getElementById('contraseña');
	const inputPassword2 = document.getElementById('contraseña2');
	
	if (inputPassword1.value !== inputPassword2.value) {
		document.getElementById(`grupo__password2`).classList.add('formulario__grupo-incorrecto');
		document.getElementById(`grupo__password2`).classList.remove('formulario__grupo-correcto');
		document.querySelector(`#grupo__password2 i`).classList.add('fa-times-circle');
		document.querySelector(`#grupo__password2 i`).classList.remove('fa-check-circle');
		document.querySelector(`#grupo__password2 .formulario__input-error`).classList.add('formulario__input-error-activo');
		campos['contraseña'] = false;
	} else {
		document.getElementById(`grupo__password2`).classList.remove('formulario__grupo-incorrecto');
		document.getElementById(`grupo__password2`).classList.add('formulario__grupo-correcto');
		document.querySelector(`#grupo__password2 i`).classList.remove('fa-times-circle');
		document.querySelector(`#grupo__password2 i`).classList.add('fa-check-circle');
		document.querySelector(`#grupo__password2 .formulario__input-error`).classList.remove('formulario__input-error-activo');
		campos['contraseña'] = true;
	}
};

inputs.forEach((input) => {
	input.addEventListener('keyup', validarFormulario);
	input.addEventListener('blur', validarFormulario);
});

formulario.addEventListener('submit', (e) => {
	e.preventDefault();

	const terminos = document.getElementById('terminos');
	if(campos.nombre_usuario && campos.contraseña && campos.correo && terminos.checked ){
		// Obtener los valores de los campos
		const nombre_usuario = document.getElementById('nombre_usuario').value;
		const correo = document.getElementById('correo').value;
		const contraseña = document.getElementById('contraseña').value;

		// Crear un objeto con los datos del registro
		const datosUsuario = {
			nombre_usuario: nombre_usuario,
			correo: correo,
			contraseña: contraseña
		};

		// Guardar los datos en localStorage
		localStorage.setItem('registroUsuario', JSON.stringify(datosUsuario));

		// Reiniciar el formulario
		formulario.reset();

		// Mostrar mensaje de éxito
		document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
		setTimeout(() => {
			document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
		}, 5000);

		// Eliminar las clases de éxito
		document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
			icono.classList.remove('formulario__grupo-correcto');
		});
	} else {
		// Mostrar mensaje de error si faltan campos o términos
		document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo');
	}
});
