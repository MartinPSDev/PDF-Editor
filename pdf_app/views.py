from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from PyPDF2 import PdfFileReader, PdfFileWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from PIL import Image
from pdf2docx import Converter
from pdf2pptx import pdf2pptx
import pdfplumber
import pandas as pd
import io

def index(request):
    return JsonResponse({'status': 'API de PDF'})

@csrf_exempt
def unir_pdf(request):
    if request.method == 'POST':
        pdf_writer = PdfFileWriter()
        files = request.FILES.getlist('file')

        for f in files:
            pdf_reader = PdfFileReader(f)
            for page_num in range(pdf_reader.getNumPages()):
                page = pdf_reader.getPage(page_num)
                pdf_writer.addPage(page)

        output = io.BytesIO()
        pdf_writer.write(output)
        output.seek(0)

        response = HttpResponse(output, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="unido.pdf"'
        return response

    return JsonResponse({'status': 'Método no permitido'}, status=405)

@csrf_exempt
def editar_pagina(request):
    if request.method == 'POST':
        page_number = int(request.POST.get('page_number', -1))
        if page_number < 0:
            return JsonResponse({'status': 'Número de página inválido'}, status=400)

        file = request.FILES.get('file')
        if not file:
            return JsonResponse({'status': 'Archivo no proporcionado'}, status=400)

        pdf_reader = PdfFileReader(file)
        pdf_writer = PdfFileWriter()

        for page_num in range(pdf_reader.getNumPages()):
            if page_num != page_number:
                page = pdf_reader.getPage(page_num)
                pdf_writer.addPage(page)

        output = io.BytesIO()
        pdf_writer.write(output)
        output.seek(0)

        response = HttpResponse(output, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="editado.pdf"'
        return response

    return JsonResponse({'status': 'Método no permitido'}, status=405)

@csrf_exempt
def firmar_pdf(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        if not file:
            return JsonResponse({'status': 'Archivo no proporcionado'}, status=400)

        signature_image = request.FILES.get('signature')
        if not signature_image:
            return JsonResponse({'status': 'Imagen de firma no proporcionada'}, status=400)

        page_number = int(request.POST.get('page_number', 0))
        x = int(request.POST.get('x', 0))
        y = int(request.POST.get('y', 0))

        pdf_reader = PdfFileReader(file)
        pdf_writer = PdfFileWriter()

        packet = io.BytesIO()
        can = canvas.Canvas(packet, pagesize=letter)
        can.drawImage(signature_image, x, y, width=100, height=50)  # Ajusta el tamaño y posición de la firma
        can.save()

        packet.seek(0)
        new_pdf = PdfFileReader(packet)

        for page_num in range(pdf_reader.getNumPages()):
            page = pdf_reader.getPage(page_num)
            if page_num == page_number:
                page.mergePage(new_pdf.getPage(0))
            pdf_writer.addPage(page)

        output = io.BytesIO()
        pdf_writer.write(output)
        output.seek(0)

        response = HttpResponse(output, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="firmado.pdf"'
        return response

    return JsonResponse({'status': 'Método no permitido'}, status=405)

@csrf_exempt
def eliminar_pagina(request):
    if request.method == 'POST':
        page_number = int(request.POST.get('page_number', -1))
        if page_number < 0:
            return JsonResponse({'status': 'Número de página inválido'}, status=400)

        file = request.FILES.get('file')
        if not file:
            return JsonResponse({'status': 'Archivo no proporcionado'}, status=400)

        pdf_reader = PdfFileReader(file)
        pdf_writer = PdfFileWriter()

        for page_num in range(pdf_reader.getNumPages()):
            if page_num != page_number:
                page = pdf_reader.getPage(page_num)
                pdf_writer.addPage(page)

        output = io.BytesIO()
        pdf_writer.write(output)
        output.seek(0)

        response = HttpResponse(output, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="pagina_eliminada.pdf"'
        return response

    return JsonResponse({'status': 'Método no permitido'}, status=405)

@csrf_exempt
def imagen_a_pdf(request):
    if request.method == 'POST':
        image_file = request.FILES.get('file')
        if not image_file:
            return JsonResponse({'status': 'Archivo de imagen no proporcionado'}, status=400)

        image = Image.open(image_file)
        pdf_bytes = io.BytesIO()
        image.save(pdf_bytes, format='PDF')
        pdf_bytes.seek(0)

        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="imagen_a_pdf.pdf"'
        return response

    return JsonResponse({'status': 'Método no permitido'}, status=405)

@csrf_exempt
def pdf_a_word(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        if not file:
            return JsonResponse({'status': 'Archivo no proporcionado'}, status=400)

        pdf_bytes = io.BytesIO(file.read())
        pdf_bytes.seek(0)

        docx_bytes = io.BytesIO()
        converter = Converter(pdf_bytes)
        converter.convert(docx_bytes)
        converter.close()
        docx_bytes.seek(0)

        response = HttpResponse(docx_bytes, content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        response['Content-Disposition'] = 'attachment; filename="convertido.docx"'
        return response

    return JsonResponse({'status': 'Método no permitido'}, status=405)

@csrf_exempt
def pdf_a_powerpoint(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        if not file:
            return JsonResponse({'status': 'Archivo no proporcionado'}, status=400)

        pdf_bytes = io.BytesIO(file.read())
        pdf_bytes.seek(0)

        pptx_bytes = io.BytesIO()
        pdf2pptx(pdf_bytes, pptx_bytes)
        pptx_bytes.seek(0)

        response = HttpResponse(pptx_bytes, content_type='application/vnd.openxmlformats-officedocument.presentationml.presentation')
        response['Content-Disposition'] = 'attachment; filename="convertido.pptx"'
        return response

    return JsonResponse({'status': 'Método no permitido'}, status=405)

@csrf_exempt
def pdf_a_excel(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        if not file:
            return JsonResponse({'status': 'Archivo no proporcionado'}, status=400)

        pdf_bytes = io.BytesIO(file.read())
        pdf_bytes.seek(0)

        with pdfplumber.open(pdf_bytes) as pdf:
            all_tables = []
            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    all_tables.extend(table)

        df = pd.DataFrame(all_tables)
        excel_bytes = io.BytesIO()
        df.to_excel(excel_bytes, index=False)
        excel_bytes.seek(0)

        response = HttpResponse(excel_bytes, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="convertido.xlsx"'
        return response

    return JsonResponse({'status': 'Método no permitido'}, status=405)

@csrf_exempt
def pdf_a_texto(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        if not file:
            return JsonResponse({'status': 'Archivo no proporcionado'}, status=400)

        pdf_bytes = io.BytesIO(file.read())
        pdf_bytes.seek(0)

        text = ""
        with pdfplumber.open(pdf_bytes) as pdf:
            for page in pdf.pages:
                text += page.extract_text()

        response = HttpResponse(text, content_type='text/plain')
        response['Content-Disposition'] = 'attachment; filename="convertido.txt"'
        return response

    return JsonResponse({'status': 'Método no permitido'}, status=405)