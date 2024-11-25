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
    return render(request, 'html/crear.html')

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

# sugerencia
@login_required
def sugerencia(request):
    return render(request, 'html/sugerencia.html')

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
# Agrega tu clave API de OpenAI aquí
openai.api_key = ''

@csrf_exempt
def translate_text(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        text = data.get('text', '')
        target_language = data.get('language', '')

        if not text or not target_language:
            return JsonResponse({'error': 'Faltan datos'}, status=400)

        try:
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=f"Traduce el siguiente texto al {target_language}: {text}",
                max_tokens=1000
            )

            translated_text = response.choices[0].text.strip()

            return JsonResponse({'translated_text': translated_text})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    # Si la solicitud es GET, devolver un mensaje o un HttpResponse vacío
    return HttpResponse("La solicitud GET no está permitida en esta vista.", status=405)
