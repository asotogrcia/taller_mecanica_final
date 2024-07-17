import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class Usuario(AbstractUser):
    OPCIONES_ROL = [
    ('ESTUDIANTE','Estudiante'),
    ('GUARDIA','Guardia'),
    ('PROFESOR','Profesor'),
    ('SECRETARIO','Secretario'),
    ('JEFE_CARRERA','Jefe de Carrera'),
    ]

    email = models.EmailField(max_length=35, unique=True)
    rut = models.CharField(null=False,unique=True, max_length=12)
    token_registro = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    token_expiracion = models.DateTimeField(null=True,blank=True)
    aceptar_terminos = models.BooleanField(default=False)
    rol = models.CharField(max_length=20, choices=OPCIONES_ROL, default='ESTUDIANTE')

    groups = models.ManyToManyField(Group, related_name='usuarios')
    user_permissions = models.ManyToManyField(Permission, related_name='usuarios')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username','password']

    def __str__(self):
        return self.first_name
    


class Vehiculo(models.Model):
    NIVEL_COMBUSTIBLE = [
        ('1/4','UN CUARTO'),
        ('1/2','MEDIO'),
        ('3/4','TRES CUARTOS'),
        ('1/1','LLENO'),
    ]

    marca = models.CharField(max_length=15, null=False)
    modelo = models.CharField(max_length=25, null=False)
    patente = models.CharField(max_length=6, null=False)
    vin = models.CharField(max_length=17, null=False)
    nivel_comb = models.CharField(choices=NIVEL_COMBUSTIBLE, default='1/4')
    foto = models.ImageField(upload_to='vehicles/%Y/%m/%d/', null=True)

class DetalleSolicitud(models.Model):
    ESPACIOS_TALLER = [
        ('1RO','Primer Bloque'),
        ('2DO','Segundo Bloque'),
        ('3RO','Tercer Bloque'),
        ('4TO','Cuarto bloque'),
    ]

    vehiculo = models.OneToOneField(Vehiculo, on_delete=models.CASCADE)

    fecha_solicitud = models.DateField(auto_now_add=True)
    asignatura = models.CharField(max_length=25, null=False)
    fecha_ingreso = models.DateField(null=False)
    hora_ingreso = models.TimeField(null=False)
    profesor = models.CharField(max_length=20, null=False)
    nro_espacio = models.CharField(choices=ESPACIOS_TALLER, null=False)


class Solicitud(models.Model):
    ESTADOS_SOLICITUD = [
        ('PENDIENTE','Pendiente'),
        ('APROBADA_PROFESOR','Aprobada por Profesor'),
        ('RECHAZADA_PROFESOR','Rechazada por Profesor'),
        ('APROBADA_JEFE_CARRERA','Aprobada por Jefe de Carrera'),
        ('RECHAZADA_JEFE_CARRERA','Rechazada por Jefe de Carrera')
    ]

    estado = models.CharField(choices=ESTADOS_SOLICITUD, default='PENDIENTE', max_length=30)
    mensaje = models.TextField(max_length=100, null=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    detalle_solicitud = models.OneToOneField(DetalleSolicitud, on_delete=models.CASCADE)