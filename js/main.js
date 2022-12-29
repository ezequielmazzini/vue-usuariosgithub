const API = "https://api.github.com/users/";

// Creo instancia de vue

const app = Vue.createApp ({
    data () {
        return {
            mensage : 'Hola Vue!',
            busqueda : null,
            resultado : null,
            error : null,
            favoritos : new Map(),
        };
    },
    // En computed creamos nuestras propiedades computadas
    computed: {

        // Devuelve si ya existe en favoritos
        esFavorito () {
            return this.favoritos.has(this.resultado.id)
        },

        // Del mapa de favoritos formado por clave , valor devuelve sólo los valores
        // https://www.youtube.com/watch?v=4hrQtbaHVCQ
        valoresFavoritos () {
            return Array.from(this.favoritos.values())
        }
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
                this.resultado = data
                this.error = null
            } catch (error) {
                this.error = error
            } finally {
                this.busqueda = null
            }
        },

        // Metodo para agregar usuarios a favoritos:
        // agregar al Map una clave resultado.id, y el objeto resultado, para mas info sobre mapas ver: https://escuelavue.es/cursos/javascript-moderno/maps-javascript/
        agregarFavoritos() {
            this.favoritos.set(this.resultado.id, this.resultado)
        },

        // Metodo para eliminar de favoritos
        eliminarFavoritos() {
            this.favoritos.delete(this.resultado.id)
        },
    }

});

// Le especificamos donde montar, en este caso id="app"
// Por ahora lo voy a comentar y voy a especificicarlo en el index.html 
// app.mount ('#app')