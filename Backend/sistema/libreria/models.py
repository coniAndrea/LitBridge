from typing import Any
from django.db import models

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
