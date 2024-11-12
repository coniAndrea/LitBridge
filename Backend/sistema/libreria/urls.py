#rutas de django permiten ingresar y detetrminar si el usuario escribe algo algo en la url del navegador.
from django.urls import path
from . import views

from django.conf import settings
from django.contrib.staticfiles.urls import static

from django.urls import path
from .views import translate_text

urlpatterns = [
    #BACKEND
    path('inicio', views.inicio, name='inicio'),
    path('admin', views.login_admin, name='login'),
    path('logout', views.logout, name='logout'),
    path('nosotros', views.nosotros, name='nosotros'),
    path('libros', views.libros, name='libros'),
    path('libros/crear', views.crear_admin, name='crear_admin'),
    path('libros/editar', views.editar, name='editar'),
    path('eliminar/<int:id>/', views.eliminar, name='eliminar'),
    path('libros/editar/<int:id>/', views.editar, name='editar'),
    path('translate/', translate_text, name='translate_text'),
    #FRONTEND
    path('', views.index, name='index'),
    path('Biblioteca', views.Biblioteca, name='Biblioteca'),
    path('config', views.config, name='config'),
    path('crear_desarrollo', views.crear_desarrollo, name='crear_desarrollo'),
    path('crear', views.crear_usuario, name='crear_usuario'),
    path('escribir', views.escribir, name='escribir'),
    path('home', views.home, name='home'),
    path('index', views.index, name='index'),
    path('lectura', views.lectura, name='lectura'),
    path('login_user', views.login_user, name='login_user'),
    path('perfil', views.perfil, name='perfil'),
    path('registrar_usuario', views.registrar_usuario, name='registrar_usuario'),
    path('registro', views.registro, name='registro'),
    path('sugerencia', views.sugerencia, name='sugerencia'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)