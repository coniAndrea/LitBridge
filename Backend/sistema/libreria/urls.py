#rutas de django permiten ingresar y detetrminar si el usuario escribe algo algo en la url del navegador.
from django.urls import path
from . import views

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('nosotros', views.nosotros, name='nosotros'),
]