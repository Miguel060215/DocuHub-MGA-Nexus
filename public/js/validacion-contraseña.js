document.getElementById("contraseña1").addEventListener("input", function(){
    let valor = this.value;
    //son las reglas que quiero que cumpla el usuatio al crear una contrasena
    let tiene8 = valor.length >= 8;
    let tieneMay = /[A-Z]/.test(valor);
    let tieneNum = /[0-9]/.test(valor);
    let tieneEsp = /[!@#$%^&*(),.?":{}|<>]/.test(valor);
    //hago que el texto del html cambie de color 
    function actualizarColor(id, cumplido){
        document.getElementById(id).style.color = cumplido ? "green" : "red";
    }

    actualizarColor("minimo", tiene8);
    actualizarColor("mayuscula", tieneMay);
    actualizarColor("numero", tieneNum);
    actualizarColor("especial", tieneEsp);
});


// verifico que ambas entradas de texto coincidan
document.getElementById("contraseña2").addEventListener("input", function(){
    let cont1 = document.getElementById("contraseña1").value;
    let cont2 = this.value;
    let mensaje = document.getElementById("coincidencia");

    if(cont1 === cont2 && cont1 !== ""){
        mensaje.textContent = "Las contraseñas coinciden"
        mensaje.style.color = "green";
    }else{
        mensaje.textContent = "Las contraseñas no coinciden"
        mensaje.style.color = "red";
    }
});

function validarFormulario() {
    let cont1 = document.getElementById("contraseña1").value;
    let cont2 = document.getElementById("contraseña2").value;

    // Verifica si todas las reglas fueron cumplidas (puedes verificar el color de los p)
    if (document.getElementById("minimo").style.color !== "green") {
        alert("La contraseña no cumple los requisitos");
        return false; 
    }
    
    if (cont1 !== cont2) {
        alert("Las contraseñas no coinciden");
        return false;
    }
    
    return true; 
}

//funcion para poder ver el contenido del input de contrasena
//https://emojikeyboard.top/es/
const botones = document.querySelectorAll(".toggle-pass");

botones.forEach(boton => {
    boton.addEventListener("click", function() {
        // 'this' se refiere al botón específico que presionaste
        let input = this.previousElementSibling; 

        if (input.type === "password") {
            input.type = "text";
            this.textContent = "🙈"; 
        } else {
            input.type = "password";
            this.textContent = "​👀​"; 
        }
    });
});