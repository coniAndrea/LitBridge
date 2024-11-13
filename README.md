# LitBridge
comandos a ejecutar en el terminal para para la funcionalidad del crud:
1.- se instala el django necesario para la configuración: pip3 install Django==3.2.8
2.- Se crea la tabla libreria en xampp para guardar la información y vinvular BD: python manage.py startapp libreria
3.- confirmar que el sistema tenga "pillow y "mysql" para la conexión, si no se debe instalar: pip3 list
4.- subir los cambios haciendo un migrate: python manage.py makemigrations
5.- ultimo migrate: python manage.py migrate
