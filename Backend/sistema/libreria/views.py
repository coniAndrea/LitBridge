from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Libro
from .forms import LibroForm
from .models import Administrador
from django.db import connection
import openai
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, get_user_model
import json
from django.contrib.auth.decorators import login_required

from django.contrib.auth.hashers import make_password, check_password

# Create your views here.

    # BACKEND #
# LOGIN ADMIN
def login_admin(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        try:
            # Buscamos al usuario en la base de datos
            admin = Administrador.objects.get(usuario=username, contraseña=password)
            # Si se encuentra, redirigir a la página de inicio
            return redirect('inicio')
        except Administrador.DoesNotExist:
            # Si no se encuentra, mostrar un mensaje de error
            messages.error(request, 'Usuario o contraseña incorrectos.')
    
    return render(request, 'registration/loginAdmin.html')

# LOGOUT USUARIO
def logout(request):
    return redirect('login')

#PÁGINA DE INICIO
def inicio(request):
    return render(request, '')
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

# Agrega tu clave API de OpenAI aquí
openai.api_key = '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'

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

    # FRONTEND #
# biblioteca
def biblioteca(request):
    return render(request, 'html/biblioteca.html')

# config
def config(request):
    return render(request, 'html/configuraciones.html')

#crear_desarrollo
def crear_desarrollo(request):
    return render(request, 'html/crear desarrollo.html')

#crear
def crear_usuario(request):
    return render(request, 'html/crear.html')

#escribir
def escribir(request):
    return render(request, 'html/escribir.html')

# home
#@login_required
def home(request):
    return render(request, 'html/home.html')

#index
def index(request):
    return render(request, 'html/index.html')

# lectura
def lectura(request):
    return render(request, 'html/lectura.html')

# login
def login_usuario(request):
    return render(request, 'html/login.html')

# perfil
def perfil(request):
    return render(request, 'html/perfil.html')

# sugerencia
def sugerencia(request):
    return render(request, 'html/sugerencia.html')

def registro(request):
    return render(request, 'html/registro.html')

#registro usuario
def registrar_usuario(request):
    if request.method == 'POST':
        nombre_usuario = request.POST['nombre_usuario']
        correo = request.POST['correo']
        contraseña = request.POST['contraseña']

        # Guardar el nuevo usuario en la base de datos
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO usuarios (nombre_usuario, correo, contraseña)
                VALUES (%s, %s, %s)
            """, [nombre_usuario, correo, contraseña])
    return render(request, 'html/registro.html')

# LOGIN USUARIO
def login_user(request):
    if request.method == 'POST':
        username = request.POST.get('usuario')
        password = request.POST.get('password')

        # Imprime para depuración
        print(f"Usuario: {username}, Contraseña: {password}")

        # Autenticar usuario manualmente con la base de datos de XAMPP
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM usuarios WHERE nombre_usuario = %s AND contraseña = %s
                """, [username, password])
                user = cursor.fetchone()  # Obtiene una fila si coincide, o None si no existe

            if user:
                # Si el usuario se encuentra, iniciar sesión (aquí simulado) y redirigir
                request.session['usuario'] = username  # Puedes almacenar el usuario en la sesión
                print("Autenticación exitosa, redirigiendo a home.")
                return redirect('home')  # Redirige a la vista 'home' en urls.py
            else:
                # Si la autenticación falla, muestra un mensaje de error sin redirigir
                print("Autenticación fallida, mostrando mensaje de error.")
                messages.error(request, 'Usuario o contraseña incorrectos.')
        except Exception as e:
            print(f"Error en la autenticación: {e}")
            messages.error(request, 'Error en el sistema de autenticación.')

    # Renderiza la página de inicio de sesión nuevamente si falla la autenticación o es un GET request
    return render(request, 'html/login.html')

# LOGIN USUARIO
"""User = get_user_model()

def login_user(request):
    if request.method == 'POST':
        username = request.POST.get('usuario')
        password = request.POST.get('password')

        # Autenticar con base de datos XAMPP
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM usuarios WHERE nombre_usuario = %s", [username])
                row = cursor.fetchone()

            if row and check_password(password, row[1]):  # row[1] asume que es la columna de contraseña con hash
                # Verificar si el usuario existe en Django; si no, crearlo
                user, created = User.objects.get_or_create(username=username)

#Configurar contraseña para el usuario en Django si es necesario
                if created:
                    user.password = make_password(password)  # Guardar contraseña con hash en Django
                    user.save()

                # Autenticar y iniciar sesión
                django_user = authenticate(request, username=username, password=password)
                if django_user is not None:
                    login(request, django_user)
                    return redirect('home')
                else:
                    messages.error(request, 'Autenticación fallida al integrar con Django.')
            else:
                messages.error(request, 'Usuario o contraseña incorrectos.')
        except Exception as e:
            print(f"Error en la autenticación: {e}")
            messages.error(request, 'Error en el sistema de autenticación.')

    return render(request, 'html/login.html')"""