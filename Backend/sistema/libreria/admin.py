from django.contrib import admin
from .models import Libro, Creacion, Administrador
# Register your models here.
admin.site.register(Libro)
admin.site.register(Creacion)
admin.site.register(Administrador)
