import openai

# Configuración de la clave API
openai.api_key = 'key_api'

# Función para traducir texto
def translate_text(text, target_language):
    # Parámetros de solicitud
    request_params = {
        "model": "text-davinci-003",  # Asegúrate de usar un modelo actualizado
        "prompt": f"Translate the following text into {target_language}: {text}",
        "temperature": 0.7,
        "max_tokens": 1000,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
    }

    # Enviar solicitud a la API
    try:
        response = openai.Completion.create(**request_params)
        translated_text = response.choices[0].text.strip()
        return translated_text
    except Exception as e:
        return f"Error: {str(e)}"

# Uso de la función
text = "Hola mundo"
target_language = "English"  # Lenguaje objetivo en inglés
traduction = translate_text(text, target_language)
print(traduction)
