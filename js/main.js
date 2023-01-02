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

    /* Created es un metodo que se ejecuta cuando se crea la instancia de vue, lo vamos a utilizar para recuperar los favoritos guardados en localStorage y luego mostrarlos
    
    - escuela vue: https://escuelavue.es/cursos/curso-vue-3-desde-cero/ciclo-vida-vue-3/
    - ciclo de vida vue: https://vuejs.org/guide/essentials/lifecycle.html
    - JSON.parse: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse  */
    created() {
        const guardadosFavoritos = JSON.parse(window.localStorage.getItem('favoritos'))
        console.log(guardadosFavoritos)

        /* Comprueba que haya favoritos guardados y los carga en el mapa de favoritos 
        El operador ?. comprueba la existencia, entonces en este ejemplo se compueba la existencia y también que la longitus sea distinta de 0.
        documentación : https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Optional_chaining */
        if (guardadosFavoritos?.length) {
            const favoritos = new Map (guardadosFavoritos.map(favoritos => [favoritos.id, favoritos]))
            this.favoritos = favoritos
        }
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
            this.guardarLocal()
        },

        // Metodo para eliminar de favoritos
        eliminarFavoritos() {
            this.favoritos.delete(this.resultado.id)
            this.guardarLocal()
        },

    
        /* Metodo para mostar en el cuadro de busqueda el favorito al que se le hace click.
        Este metodo carga en la variable "resultado" el favorito al que se le hio click. En resultado normalmente tenemos los resultados de la búsqueda*/
        mostrarFavorito(favoritos) {
            this.resultado = favoritos
        },

        /* Persistencia: Este método guarda en el almacenamiento local del navegador los favoritos para que sobrevivan a la regarga de pagina o al cerrar el navegador.
        - escuela vue: https://escuelavue.es/cursos/curso-vue-3-desde-cero/vue-local-storage/  
        - window.localStorage: https://developer.mozilla.org/es/docs/Web/API/Window/localStorage
        - JSON.stringify: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify  */
        guardarLocal () {
            window.localStorage.setItem ('favoritos', JSON.stringify(this.valoresFavoritos))
        }
    }

});

// Le especificamos donde montar, en este caso id="app"
// Por ahora lo voy a comentar y voy a especificicarlo en el index.html 
// app.mount ('#app')