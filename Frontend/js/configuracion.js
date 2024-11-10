function showSection(section) {
    const sections = document.querySelectorAll('.section');
    sections.forEach((sec) => {
        sec.style.display = 'none';
    });
    document.getElementById(section).style.display = 'block';

    const links = document.querySelectorAll('.settings-menu a');
    links.forEach((link) => {
        link.classList.remove('active');
    });
    const activeLink = Array.from(links).find(link => link.textContent.toLowerCase() === section);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

//CONFIGURACIÓN DE LA CUENTA

 //GUARDAR CAMBIO
async function guardarCambios() {
    //OBTENR VALORES DEL FORMULARIO
    const username = document.getElementById("username").Value;
    const password = document.getElementById("password").Value;
    const email = document.getElementById("email").Value;
    
    //ENVIA DATOS AL BACKEND

    try{
        const response = await fetch('/api/guardar-cambios',{
            method: 'POST',
            headers: {
                'content-type':'application/json'
            },
            body:JSON.stringify({username, password, email})
        });

        if (response.ok){
            alert('Cambios guardados con éxito');
        }else{
          alert('Error al guardar cambios');
        }
    }catch (error){
        console.error('Error en la solicitud:',error);
        alert('Error en la solicitud');
    }
}
 //CERRRAR CUENTA PARA SIEMPRE

async function cerrarCuenta(){
   //configuración antes de cerrar la cuenta
   const confirmacion =confirm('¿ Estás segura de que quieres cerrar tu cuenta? Esta acción es irrevarsible.')
    if(confirmacion){
        try{
            const response = await fetch('/api/cerrar-cuenta',{
                meethod: 'DELETE'
            });

            if(response.ok){
                alert('Cuenta cerrada con éxito');
                window.location.href='/logout';
            }else{
                alert('Error al eliminar la cuenta');
            }
        }catch (error){
            console.error('Error en la solicitus:', error);
            alert('Error en la solicitud');
        }
    }
}


//CONFIGURACIÓN DE LAS NOTIFICACIÓN 

// CONFIGURACION DEL IDIOMA DE LA CUENTA --> IMPLEMENTACIÓN DE LA API PARA LA TRADUCCION 
   //solo permite seleccionar una opción 
   document.querySelectorAll('input[name="language"]').forEach((checkbox) => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            document.querySelectorAll('input[name="language"]').forEach((otherCheckbox) => {
                if (otherCheckbox !== this) {
                    otherCheckbox.checked = false;
                }
            });
        }
    });
});
    