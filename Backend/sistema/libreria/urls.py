#rutas de django permiten ingresar y detetrminar si el usuario escribe algo algo en la url del navegador.
from django.urls import path
from . import views
from django.conf import settings
from django.contrib.staticfiles.urls import static
from django.contrib.auth import views as auth_views
from django.contrib.auth.views import (
    LoginView,
    PasswordResetView,
    PasswordResetDoneView,
    PasswordResetConfirmView,
    PasswordResetCompleteView
)

urlpatterns = [
    #BACKEND
    path('inicio', views.inicio, name='inicio'),
    path('admin', views.login_admin, name='login_admin'),
    path('logout', views.logout_view, name='logout'),
    path('nosotros', views.nosotros, name='nosotros'),
    path('libros', views.libros, name='libros'),
    path('libros/crear', views.crear_admin, name='crear_admin'),
    path('libros/editar', views.editar, name='editar'),
    path('eliminar/<int:id>/', views.eliminar, name='eliminar'),
    path('libros/editar/<int:id>/', views.editar, name='editar'),
    #FRONTEND
    path('', views.index, name='index'),
    path('biblioteca', views.biblioteca, name='biblioteca'),
    path('config', views.config, name='config'),
    path('crear_desarrollo', views.crear_desarrollo, name='crear_desarrollo'),
    path('creaciones/', views.listar_creaciones, name='listar_creaciones'),
    path('crear', views.crear_usuario, name='crear_usuario'),
    path('escribir_editar/<int:id>/', views.escribir_editar, name='escribir_editar'),  
    path('eliminar/<int:id>/', views.eliminar, name='eliminar'),  
    path('escribir', views.escribir, name='escribir'),
    path('home', views.home, name='home'),
    path('index', views.index, name='index'),
    path('lectura', views.lectura, name='lectura'),
    path('login', views.login_usuario, name='login'),
    path('login_backend', views.login_view, name='login_backend'),
    path('perfil', views.perfil, name='perfil'),
    path('perfil/editar/', views.editar_perfil, name='editar_perfil'),
    path('registrar_usuario', views.registrar_usuario, name='registrar_usuario'),
    path('registro', views.registro, name='registro'),
    path('buzon', views.buzon, name='buzon'),
    path('login', LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('password_reset/', PasswordResetView.as_view(
        template_name='registration/password_reset_form.html',
        email_template_name='registration/password_reset_email.html', 
    ), name='password_reset'),
    path('password_reset/done/', PasswordResetDoneView.as_view(
        template_name='registration/password_reset_done.html'
    ), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', PasswordResetConfirmView.as_view(
        template_name='registration/password_reset_confirm.html',
    ), name='password_reset_confirm'),
    path('reset/done/', PasswordResetCompleteView.as_view(
        template_name='registration/password_reset_complete.html'
    ), name='password_reset_complete'),
    path('vista_previa', views.vista_previa, name='vista_previa'),
    path('editar_perfil/', views.editar_perfil, name='editar_perfil'),
    path('generar_traducciones/', views.generar_traducciones, name='generar_traducciones'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)