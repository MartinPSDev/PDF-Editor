from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('unir_pdf/', views.unir_pdf, name='unir_pdf'),
    path('editar_pagina/', views.editar_pagina, name='editar_pagina'),
    path('firmar_pdf/', views.firmar_pdf, name='firmar_pdf'),
    path('eliminar_pagina/', views.eliminar_pagina, name='eliminar_pagina'),
    path('imagen_a_pdf/', views.imagen_a_pdf, name='imagen_a_pdf'),
    path('pdf_a_word/', views.pdf_a_word, name='pdf_a_word'),
    path('pdf_a_powerpoint/', views.pdf_a_powerpoint, name='pdf_a_powerpoint'),
    path('pdf_a_excel/', views.pdf_a_excel, name='pdf_a_excel'),
    path('pdf_a_texto/', views.pdf_a_texto, name='pdf_a_texto'),
]