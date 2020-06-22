
import firebase from './../firebase'

const fileHelper = {
    /**
     * Perview a selected image before uploading
     */
    previewSelectedImage: (file, preview_container) => {
        console.log()
        const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp|.mp4)$/;
            let preview = document.querySelector(preview_container)
            preview.innerHTML = ''; //clear previous preview (if any..);
            if (regex.test(file.name.toLowerCase())){//If a valid image
                var reader = new FileReader();
                reader.onload = function(e){
                        var imageContainer = document.createElement('div');
                        imageContainer.style.width = preview.getAttribute('preview-width') || '100%';
                        imageContainer.style.height = preview.getAttribute('preview-height') || 'auto';

                        var image = new Image();
                        image.src = e.target.result;
                        image.style.width = '100%';
                        image.style.height = preview.getAttribute('preview-height') || 'auto';
                        imageContainer.appendChild(image);
                    
                        preview.appendChild(imageContainer);
                    }
                reader.readAsDataURL(file);
            }else{
            //input.files.splice(i,1);//remove from the file array
            alert(file.name+' is not a valid image');
            }
    },
    /**
     * upload file to firestore storage
     */
    uploadFile: (file, path) => {
        const storageRef = firebase.storage.ref();
       return  storageRef.child(path).put(file)
    }
}

export default fileHelper