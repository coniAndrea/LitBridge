from django import forms
from .models import Libro, Creacion, PerfilUsuario
from django.contrib.auth.models import User
from .models import PerfilUsuario

class LibroForm(forms.ModelForm):
    class Meta:
        model = Libro
        fields ='__all__'

class LoginForm(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(widget=forms.PasswordInput)

class RegistroForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, label="Contraseña")
    password_confirm = forms.CharField(widget=forms.PasswordInput, label="Confirmar contraseña")

    class Meta:
        model = User  # Asocia el formulario al modelo User
        fields = ['username', 'email', 'password']  # Campos a incluir en el formulario

class PerfilUsuarioForm(forms.ModelForm):
    class Meta:
        model = PerfilUsuario
        fields = ['genero', 'informacion', 'sitio_web', 'ubicacion', 'imagen_perfil', 'imagen_fondo']

class CreacionForm(forms.ModelForm):
    class Meta:
        model = Creacion
        fields = ['titulo', 'categoria', 'descripcion', 'idioma', 'portada', 'derechos_autor']
