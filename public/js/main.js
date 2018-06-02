// Semantic UI Codes:

$(".ui.dropdown").dropdown();

// To fix navbar on top when mouse scrolls down
$(window).bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta >= 0) {
        $("#top-nav").removeClass("fixed");
    }
    else {
        $("#top-nav").addClass("fixed");
    }
});

// Show a modal when post author clicks 'delete post' button
$("#deletePostButton").on("click",function(){
    $("#deletePostModal").modal("show");
});

//Delete confirmation button inside modal
$(".delete-form").on("click",function(){
  $(this).submit();
});

// Fading out flash messages when close button is clicked
$('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  });

// TinyMCE editor initialization:

$(document).ready(function() {
    tinymce.init({
      selector: ".area-text",
      theme: "modern",
      paste_data_images: true,
      plugins: [
        "advlist autolink lists link image charmap print preview hr anchor pagebreak",
        "searchreplace wordcount visualblocks visualchars code fullscreen",
        "insertdatetime media nonbreaking save table contextmenu directionality",
        "emoticons template paste textcolor colorpicker textpattern"
      ],
      toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
      toolbar2: "print preview media | forecolor backcolor emoticons",
      image_advtab: true,
      file_picker_callback: function(callback, value, meta) {
        if (meta.filetype == 'image') {
          $('#upload').trigger('click');
          $('#upload').on('change', function() {
            var file = this.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
              callback(e.target.result, {
                alt: ''
              });
            };
            reader.readAsDataURL(file);
          });
        }
      },
      templates: [{
        title: 'Test template 1',
        content: 'Test 1'
      }, {
        title: 'Test template 2',
        content: 'Test 2'
      }]
    });
  });

