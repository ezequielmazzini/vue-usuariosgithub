const API = "https://api.github.com/users/";

// Creo instancia de vue

const app = Vue.createApp ({
    data () {
        return {
            mensage : 'Hola Vue!',
            busqueda : null,
            resultado : null,
            error : null,
        };
    },
    // En methods creamos los metodos y funciones que usara nuestra app
    methods: {
        async doSearch () {
            // this.busqueda accede a la variable busqueda
            this.resultado = this.error = null
            try {
                const response = await fetch (API + this.busqueda)
                console.log(response)
                if (!response.ok) throw new Error ("Usuario no encontrado")
                const data = await response.json ()
                console.log(data)
                this.resultado = true
                this.error = null
            } catch (error) {
                this.error = error
            } finally {
                this.busqueda = null
            }

        }
    }

});

// Le especificamos donde montar, en este caso id="app"
// Por ahora lo voy a comentar y voy a especificicarlo en el index.html 
// app.mount ('#app')