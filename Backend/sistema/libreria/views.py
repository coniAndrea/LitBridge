from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Libro, Usuario
from .forms import LibroForm
from .models import Administrador
from django.db import connection
import openai
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
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
    
    return render(request, 'registration/login.html')

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
    return render(request, 'html/Biblioteca.html')

# config
def config(request):
    return render(request, 'html/configuraciones.html')

#crear_desarrollo
def crear_desarrollo(request):
    return render(request, 'html/crear_desarrollo.html')

#crear
def crear_usuario(request):
    return render(request, 'html/crear.html')

#escribir
def escribir(request):
    return render(request, 'html/escribir.html')

# home
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
        
        return redirect('home')  # Redirigir a la página principal o a la que quieras
    return render(request, 'html/home.html')

# LOGIN USUARIO
def login_user(request):
    if request.method == 'POST':
        usuario = request.POST.get('usuario')
        password = request.POST.get('password')
        
        try:
            # Busca al usuario en la base de datos por el nombre de usuario o correo
            user = Usuario.objects.get(nombre_usuario=usuario, contraseña=password)
            # Si el usuario se encuentra, redirige a la página de inicio
            return redirect('html/home.html')
        except Usuario.DoesNotExist:
            # Si no se encuentra, muestra un mensaje de error
            messages.error(request, 'Usuario o contraseña incorrectos.')

    return render(request, 'html/home.html')