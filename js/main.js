const API = "https://api.github.com/users/";

// constante donde defino el tiempo maximo en milisegundos que puedo tener un favorito sin actualizarlo

const tiempoMaximoFavoritoMs = 10000 // son 10000 ms = 10 segundos

// Creo instancia de vue

const app = Vue.createApp ({
    data () {
        return {
            mensage : 'Busquemos usuarios!',
            busqueda : null,
            resultado : null,
            error : null,
            favoritos : new Map(),
        };
    },

    /* created es un metodo que se ejecuta cuando se crea la instancia de vue, lo vamos a utilizar para recuperar los favoritos guardados en localStorage y luego mostrarlos
    
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
            const favoritos = new Map (guardadosFavoritos.map(favoritos => [favoritos.login, favoritos]))
            this.favoritos = favoritos
        }
    },

    // En computed creamos nuestras propiedades computadas
    computed: {

        // Devuelve si ya existe en favoritos
        esFavorito () {
            return this.favoritos.has(this.resultado.login)
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
            /* Antes de ejecutar la petición del bloque try, vamos a buscar si ya tenemos el favorito en el cache :
            https://escuelavue.es/cursos/curso-vue-3-desde-cero/cachear-http-vue-3/
            para eso buscamos y traemos el valor a buscar de los favoritos existentes :
            - this.favoritos.get(this.busqueda)
            si existe y los guardo en favoritoEnCache, sino sigue ejecutando el bloque try
            !! lo que hace es convertir el objeto a booleano
            */
            this.resultado = this.error = null

            const favoritoEnCache = this.favoritos.get(this.busqueda)

            /* Voy a crear una estructura que me permita saber si el favorito es viejo y debo actualizarlo
            */
           const deboActualizarFavorito = (() => {
            if (!!favoritoEnCache) { // si existe el favorito en cache...
                const { ultimaActualizacion } = favoritoEnCache // defino
                const now = Date.now () // defino
                return (now - ultimaActualizacion) > tiempoMaximoFavoritoMs // devuelve TRUE si la ultima actualización es mayor al tiempo maximo ya establecido
            }
            return false 
           })()

            if (!!favoritoEnCache && !deboActualizarFavorito) {
            console.log("Encontrado y usamos la version en cache")
            return this.resultado = favoritoEnCache
            }

            try {
                console.log ("No encontrado en cache o es antiguo")
                const response = await fetch (API + this.busqueda)
                console.log(response)
                if (!response.ok) throw new Error ("Usuario no encontrado")
                const data = await response.json ()
                console.log(data)
                this.resultado = data
                this.resultado.ultimaActualizacion = Date.now() //dudas sobre favoritoencache
                this.error = null
            } catch (error) {
                this.error = error
            } finally {
                this.busqueda = null
            }
        },

        /* Metodo para agregar usuarios a favoritos:
        agregar al Map una clave resultado.login, y el objeto resultado, para mas info sobre mapas ver: https://escuelavue.es/cursos/javascript-moderno/maps-javascript/ 
        Se cambia la clave del mapa al login para que sea mas sencilla la busqueda dentro de los favoritos 
        Agregamos ultimaActualizacion, que va a ser un valor en milisegundos, para saber hace cuanto esta agregado a favoritos y saber si debe actualizarlo

        */
        agregarFavoritos() {
            this.resultado.ultimaActualizacion = Date.now ()
            this.favoritos.set(this.resultado.login, this.resultado)
            this.guardarLocal()
        },

        // Metodo para eliminar de favoritos
        eliminarFavoritos() {
            this.favoritos.delete(this.resultado.login)
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