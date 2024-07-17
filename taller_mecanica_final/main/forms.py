from django import forms
from .models import Usuario
from django.contrib.auth.forms import UserCreationForm

class LoginForm(forms.Form):
    email = forms.EmailField(label='', required=True, max_length=35, widget=forms.TextInput(attrs={'placeholder':'Correo Electrónico'}))
    password = forms.CharField(label='', max_length=255, required=True, widget=forms.TextInput(attrs={'placeholder':'Contraseña'}))

class RegisterForm(forms.ModelForm):
    aceptar_terminos = forms.BooleanField(label="Acepto los términos y condiciones", required=True)
    username = forms.CharField(help_text='',label='', widget=forms.TextInput(attrs={'placeholder':'Nombre Usuario'}))

    class Meta:
        model = Usuario
        fields = ['username','first_name','last_name','rut','email','password','aceptar_terminos']
        
        widgets = {
            'first_name': forms.TextInput(attrs={'placeholder':'Nombre'}),
            'last_name': forms.TextInput(attrs={'placeholder':'Apellido'}),
            'rut': forms.TextInput(attrs={'placeholder':'RUT (Con puntos y guión)'}),
            'email': forms.TextInput(attrs={'placeholder':'Correo Electrónico'}),
            'password': forms.PasswordInput(attrs={'placeholder':'Contraseña'})
        }

        labels = {
            'first_name': '',
            'last_name': '',
            'rut': '',
            'email': '',
            'password': ''
        }

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields['username'].required = True
            self.fields['first_name'].required = True
            self.fields['last_name'].required = True
            self.fields['rut'].required = True
            self.fields['email'].required = True
            self.fields['password'].required = True
            self.fields['aceptar_terminos'].required = True


class VerifyForm(forms.Form):
    email = forms.EmailField(label='', required=True, widget=forms.TextInput(attrs={'placeholder':'Correo Electrónico'}))
    token = forms.UUIDField(label='', required=True, widget=forms.TextInput(attrs={'placeholder':'Token Validación'}))