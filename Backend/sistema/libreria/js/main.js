$(document).ready(function() {
    $('#translateForm').on('submit', function(event) {
        event.preventDefault();

        const text = $('#text').val();
        const language = $('#language').val();

        if (text.length > 1000) {
            alert("El texto no puede tener más de 1000 palabras.");
            return;
        }

        $.ajax({
            url: '/translate/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                text: text,
                language: language
            }),
            success: function(response) {
                $('#translatedText').text(response.translated_text);
            },
            error: function(error) {
                console.log(error);
                alert('Hubo un error al traducir el texto.');
            }
        });
    });
});
