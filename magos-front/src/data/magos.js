const imagenesPorNombre = {
    'harry potter':       '/img/harry.jpg',
    'hermione granger':   '/img/hermione.jpg',
    'ron weasley':        '/img/ron.jpg',
    'albus dumbledore':   '/img/dumbledore.png',
    'severus snape':      '/img/snape.jpg',
    'draco malfoy':       '/img/draco.jpg',
    'cedric diggory':     '/img/cedric.png',
    'luna lovegood':      '/img/luna.jpg',
    'cho chang':          '/img/cho.jpg',
    'neville longbottom': '/img/neville.jpg'
}

export const getImagen = (nombre) => {

    if (nombre) {
        return imagenesPorNombre[nombre.toLowerCase()]
    }
}
