from typing import Any
from django.db import models
from django.contrib.auth.hashers import make_password, check_password

# Create your models here.
class Libro(models.Model):
    id= models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=50, verbose_name="Titulo")
    imagen = models.ImageField(upload_to='imagenes/',verbose_name="Imagen", null=True)
    descripcion = models.TextField(verbose_name="Descripción", null=True)

    def __str__(self):
        fila = "Titulo: " + self.titulo #+ " - " + "descripcion: " + self.descripcion
        return fila
    
    def delete(self, using=None, keep_parents=False):
        # Elimina la imagen asociada antes de borrar el objeto
        if self.imagen:
            self.imagen.storage.delete(self.imagen.name)
        super().delete(using=using, keep_parents=keep_parents)

from django.db import models

class Administrador(models.Model):
    id_admin = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    correo = models.EmailField(max_length=100)
    contraseña = models.CharField(max_length=100)
    usuario = models.CharField(max_length=50)

    class Meta:
        db_table = 'administradores'  # Nombre exacto de la tabla existente en tu base de datos

    def __str__(self):
        return self.usuario
    