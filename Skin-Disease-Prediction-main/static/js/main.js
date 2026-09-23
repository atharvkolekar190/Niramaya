// Main JavaScript for Skin Disease Prediction App

$(document).ready(function() {
    // Handle file input change
    $('#imageUpload').change(function(e) {
        const file = e.target.files[0];
        if (file) {
            // Show image preview
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#imagePreview').html('<img src="' + e.target.result + '" alt="Preview">');
                $('.image-section').show();
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle predict button click
    $('#btn-predict').click(function() {
        const formData = new FormData();
        const fileInput = $('#imageUpload')[0];
        
        if (fileInput.files.length === 0) {
            alert('Please select an image first!');
            return;
        }

        formData.append('image', fileInput.files[0]);
        
        // Show loader
        $('.loader').show();
        $('#result').text('');
        
        // Make prediction request
        $.ajax({
            url: '/predict',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            timeout: 30000, // 30 second timeout
            success: function(response) {
                $('.loader').hide();
                $('#result').text(response);
            },
            error: function(xhr, status, error) {
                $('.loader').hide();
                let errorMessage = 'Error occurred during prediction.';
                if (xhr.status === 0) {
                    errorMessage = 'Connection failed. Please check if the server is running.';
                } else if (xhr.status === 404) {
                    errorMessage = 'Prediction endpoint not found.';
                } else if (xhr.status === 500) {
                    errorMessage = 'Server error occurred.';
                } else if (status === 'timeout') {
                    errorMessage = 'Request timed out. Please try again.';
                }
                $('#result').text(errorMessage);
                console.error('AJAX Error:', {xhr: xhr, status: status, error: error});
            }
        });
    });

    // Handle form submission
    $('#upload-file').submit(function(e) {
        e.preventDefault();
        $('#btn-predict').click();
    });
});
