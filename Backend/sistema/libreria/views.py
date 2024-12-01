from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.utils.http import urlsafe_base64_encode
from .models import Libro
from .forms import LibroForm
from .models import Administrador
from django.db import connection
import openai
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from .forms import LoginForm
from django.contrib.auth.views import PasswordResetView
from .models import PerfilUsuario
from .forms import PerfilUsuarioForm
from .forms import CreacionForm
from .models import Creacion
import requests
from django.http import HttpResponse
import xml.etree.ElementTree as ET
from googletrans import Translator 
# Create your views here.

    # BACKEND #
# LOGIN ADMIN
def login_admin(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM administradores WHERE usuario = %s AND contraseña = %s
                """, [username, password])
                user = cursor.fetchone()

            if user:
                request.session['username'] = username
                return redirect('inicio')
            else:
                # Personaliza el mensaje de error
                messages.error(request, '⚠️ Usuario o contraseña incorrectos. Intenta nuevamente.')
        except Exception as e:
            messages.error(request, '❌ Ha ocurrido un error en el sistema de autenticación.')

    return render(request, 'registration/login_admin.html')

#PÁGINA DE INICIO
def inicio(request):
    return render(request, 'paginas/inicio.html')

def nosotros(request):
    return render(request, 'paginas/nosotros.html')

#ADMINISTRAR LIBROS
def libros(request):
    libros = Libro.objects.all()
    return render(request, 'libros/index.html', {'libros': libros})

def crear_admin(request):
    formulario  = LibroForm(request.POST or None, request.FILES or None)
    if formulario.is_valid():
        formulario.save()
        return redirect('libros')
    return render(request, 'libros/crear.html', {'formulario': formulario})

def editar(request,id):
    libro = Libro.objects.get(id=id)
    formulario = LibroForm(request.POST or None, request.FILES or None, instance=libro)
    if formulario.is_valid() and request.method == 'POST':
        formulario.save()
        return redirect('libros')
    return render(request, 'libros/editar.html', {'formulario': formulario})

def eliminar(request, id):
    libro = Libro.objects.get(id=id)
    libro.delete()
    return redirect('libros')

    # FRONTEND #
# biblioteca
@login_required
def biblioteca(request):
    return render(request, 'html/biblioteca.html')

# config
@login_required
def config(request):
    return render(request, 'html/configuraciones.html')

#crear_desarrollo
@login_required
def crear_desarrollo(request):
    return render(request, 'html/crear desarrollo.html')

#crear
@login_required
def crear_usuario(request):
    form  = CreacionForm(request.POST or None, request.FILES or None)
    if form.is_valid():
        form.save()
        return redirect('crear_desarrollo')
    return render(request, 'html/crear.html', {'form': form})

@login_required
def listar_creaciones(request):
    creaciones = Creacion.objects.all()  # Obtiene todas las creaciones de la base de datos
    return render(request, 'html/escribir.html', {'creaciones': creaciones})

@login_required
def escribir_editar(request, id):
    creacion = get_object_or_404(Creacion, id=id)  # Usamos get_object_or_404 para evitar errores si no se encuentra el objeto
    formulario = CreacionForm(request.POST or None, request.FILES or None, instance=creacion)  # El formulario que se usará para editar
    
    if formulario.is_valid() and request.method == 'POST':
        formulario.save()  # Guarda los cambios si el formulario es válido
        return redirect('listar_creaciones')  # Redirige a la lista de creaciones después de guardar
    
    return render(request, 'html/escribir_editar.html', {'formulario': formulario, 'creacion': creacion})

@login_required
def eliminar(request, id):
    creacion = get_object_or_404(Creacion, id=id)  # Usamos get_object_or_404 para evitar errores si no se encuentra el objeto
    creacion.delete()  # Elimina el objeto
    return redirect('listar_creaciones')

#escribir
@login_required
def escribir(request):
    return render(request, 'html/escribir.html')

# home
@login_required
def home(request):
    return render(request, 'html/home.html')

#index
def index(request):
    return render(request, 'html/index.html')

# lectura
@login_required
def lectura(request):
    return render(request, 'html/lectura.html')

# login
def login_usuario(request):
    return render(request, 'html/login.html')

# perfil
@login_required
def perfil(request):
    return render(request, 'html/perfil.html')

@login_required
def editar_perfil(request):
    perfil = PerfilUsuarioForm(request.POST or None, request.FILES or None)  # Obtener el perfil asociado al usuario actual
    if perfil.is_valid():
        perfil.save()
        return redirect('libros')
    return render(request, 'html/perfil.html', {'perfil': perfil})  # Renderizar la página con el perfil

# sugerencia
@login_required
def buzon(request):
    return render(request, 'html/buzon.html')

#registro usuario
def registro(request):
    return render(request, 'html/registro.html')

def registrar_usuario(request):
    if request.method == 'POST':
        nombre_usuario = request.POST.get('nombre_usuario')
        correo = request.POST.get('correo')
        contraseña = request.POST.get('contraseña')
        contraseña2 = request.POST.get('contraseña2')

        # Validar que las contraseñas coincidan
        if contraseña != contraseña2:
            messages.error(request, "Las contraseñas no coinciden.")
            return render(request, 'html/registro.html')  # Redirige al formulario con un mensaje de error

        # Verificar si el usuario ya existe
        if User.objects.filter(username=nombre_usuario).exists():
            messages.error(request, "El nombre de usuario ya está en uso.")
            return render(request, 'html/registro.html')

        if User.objects.filter(email=correo).exists():
            messages.error(request, "El correo electrónico ya está registrado.")
            return render(request, 'html/registro.html')

        # Crear el usuario
        user = User.objects.create_user(username=nombre_usuario, email=correo, password=contraseña)
        user.save()

        messages.success(request, "Usuario registrado exitosamente. Ahora puedes iniciar sesión.")
        return redirect('login')  # Redirige al login después de registrarse

    return render(request, 'html/registro.html')  # Muestra el formulario si no es un POST

#Vista Previa
@login_required
def vista_previa(request):
    return render(request, 'html/vista_previa.html')

# LOGIN USUARIO
def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)  # Autenticar al usuario
            if user is not None:
                login(request, user)  # Iniciar sesión
                return redirect('home')  # Redirigir al home
            else:
                messages.error(request, 'Credenciales inválidas.')
    else:
        form = LoginForm()
    return render(request, 'html/login.html')

#LOGOUT USUARIO
def logout_view(request):
    logout(request)  # Cierra la sesión del usuario
    return redirect('index')  # Redirige al usuario al índice (o a otra página)



# TRADUCTOR

def generar_traducciones(request):
    idioma = request.GET.get('idioma', 'es')  # Obtener el idioma solicitado (por defecto, español)
    descripcion = request.GET.get('descripcion', 'Descripción no disponible.')  # Descripción enviada por el cliente
    titulo = request.GET.get('titulo', 'Título no disponible.')  # Título enviado por el cliente

    # Traducciones estáticas disponibles
    traducciones_estaticas = {
        "es": {
            "book_author": "Autor del Libro",
            "welcome_message": "Bienvenido a LitBridge",
            "traducir_button": "Traducir Contenido"
        },
        "en": {
            "book_author": "Book Author",
            "welcome_message": "Welcome to LitBridge",
            "traducir_button": "Translate Content"
        }
    }

    # Seleccionar traducciones estáticas basadas en el idioma
    selected_translations = traducciones_estaticas.get(idioma, traducciones_estaticas["es"])

    # Traducir dinámicamente la descripción y el título
    translator = Translator()
    descripcion_traducida = translator.translate(descripcion, dest=idioma).text
    titulo_traducido = translator.translate(titulo, dest=idioma).text

    # Crear estructura XML
    root = ET.Element("translations")
    for key, value in selected_translations.items():
        ET.SubElement(root, "text", id=key).text = value

    # Agregar la descripción y el título traducidos al XML
    ET.SubElement(root, "text", id="book_description").text = descripcion_traducida
    ET.SubElement(root, "text", id="book_title").text = titulo_traducido

    # Crear la respuesta HTTP con el contenido XML
    response = HttpResponse(content_type="application/xml")
    response.write(ET.tostring(root, encoding="utf-8", xml_declaration=True))

    return response


def traducir(request):
    return generar_traducciones(request)
